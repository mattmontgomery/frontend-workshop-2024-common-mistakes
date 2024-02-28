export type Config = {
  antimatter?: boolean;
  slingshot?: boolean;
  stembolts?: boolean;
};

export function Configure({
  config,
  onChange,
}: {
  config: Config;
  onChange: (configKey: keyof Config, value: boolean) => void;
}) {
  return (
    <div>
      <button
        className={`lcars-button ${config["slingshot"] ? "on" : ""}`}
        onClick={() => {
          onChange("slingshot", !config.slingshot);
        }}
      >
        Initiate slingshot effect
      </button>
      <button
        className={`lcars-button ${config["stembolts"] ? "on" : ""}`}
        onClick={() => {
          onChange("stembolts", !config.stembolts);
        }}
      >
        Distribute self-sealing stem bolts
      </button>
      <button
        className={`lcars-button ${config["antimatter"] ? "on" : ""}`}
        onClick={() => {
          onChange("antimatter", !config.antimatter);
        }}
      >
        Initiate antimatter reactor
      </button>
    </div>
  );
}

export function ConfigurationDisplay({ config }: { config: Config }) {
  return (
    <div>
      {Object.keys(config)
        .filter((configItem) => config[configItem as keyof Config] === true)
        .map((a) => `${a} on`)
        .join(", ")}
    </div>
  );
}
