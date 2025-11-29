import mne
import numpy as np

class HappyClassifier:
    """
    Estimates happiness percentage based on frontal EEG asymmetry.
    """
    BETA_BAND = (13., 30.)
    ALPHA_BAND = (8., 13.)
    
    def __init__(self, sfreq, channels=['F3', 'F4'], neutral_threshold=0.5, happy_threshold=1.5):
        self.sfreq = sfreq
        self.channels = channels
        self.neutral_threshold = neutral_threshold
        self.happy_threshold = happy_threshold

    def get_happy_percentage(self, data_chunk):
        """
        Args:
            data_chunk (np.ndarray): 2D numpy array (channels, samples), must include left & right frontal.

        Returns:
            tuple: (percentage, asymmetry)
        """
        ch_names = ['F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2']
        info = mne.create_info(ch_names=ch_names, sfreq=self.sfreq, ch_types='eeg')
        raw_chunk = mne.io.RawArray(data_chunk, info, verbose=False)
        raw_chunk.pick_channels(self.channels)
        
        raw_chunk.filter(l_freq=self.ALPHA_BAND[0], h_freq=self.BETA_BAND[1], fir_design='firwin', verbose=False)
        
        spectrum = raw_chunk.compute_psd(method="welch", fmin=2., fmax=40., verbose=False)
        psd, freqs = spectrum.get_data(return_freqs=True)
        
        alpha_power = np.mean(psd[:, (freqs >= self.ALPHA_BAND[0]) & (freqs < self.ALPHA_BAND[1])])
        beta_power = np.mean(psd[:, (freqs >= self.BETA_BAND[0]) & (freqs < self.BETA_BAND[1])])

        if alpha_power < 1e-12:
            return (0.0, 0.0)

        ratio = beta_power / alpha_power

        # Normalize the ratio to a 0-100% scale
        if ratio <= self.neutral_threshold:
            percentage = 0.0
        elif ratio >= self.happy_threshold:
            percentage = 100.0
        else:
            percentage = ((ratio - self.neutral_threshold) / (self.happy_threshold - self.neutral_threshold)) * 100

        return (percentage, ratio)
import os


def test(dir_path):
    left_channel = 'F3'
    right_channel = 'F4'
    for file_name in os.listdir(dir_path):
        file_path = os.path.join(dir_path, file_name)
        raw = mne.io.read_raw_fif(file_path, preload=True, verbose=False)
        ch_names = ['F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2']
        raw.pick_channels(ch_names)
        data = raw.get_data()

        classifier = HappyClassifier(sfreq=raw.info['sfreq'])

        percentage, asymmetry = classifier.get_happy_percentage(data)
        print(f"{file_name} → Happiness: {percentage:.1f}% | Asymmetry: {asymmetry:.4f}")


test('../training-data/happy/')
test('../training-data/neutral/')
