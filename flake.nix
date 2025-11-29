{
  description = "Development flake for mooodlet-manager-react project ";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
      ];
      perSystem =
        {
          config,
          self',
          inputs',
          pkgs,
          system,
          ...
        }:
        let
          pythonEnv = pkgs.python3.withPackages (ps: with ps; [
            mne
            numpy
          ]);
        in
        {
          # Set formatter for nix fmt
          formatter = pkgs.nixfmt-rfc-style;
          devShells.default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs
              pythonEnv
            ];
          };
        };
    };
}
