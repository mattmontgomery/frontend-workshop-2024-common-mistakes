"use client";

import { useEffect, useRef, useState } from "react";
import Counter from "./Counter";
import Configure, { Config, ConfigurationDisplay } from "./Configure";

function Tricorder() {
  const [config, setConfig] = useState<Config>({});
  const [isScanningForLifeForms, setIsScanningForLifeforms] =
    useState<boolean>();
  const [foundLifeforms, setFoundLifeForms] = useState<number[]>([]);

  const intervalRef = useRef<NodeJS.Timeout>();

  const soughtLifeformCount = 47;

  useEffect(() => {
    const multipliers =
      (config.antimatter ? 0.5 : 1) *
      (config.slingshot ? 0.5 : 1) *
      (config.stembolts ? 0.5 : 1);
    const interval = setInterval(() => {
      if (isScanningForLifeForms) {
        setFoundLifeForms((lifeforms) => {
          if (lifeforms.length === soughtLifeformCount && intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return lifeforms.length < soughtLifeformCount
            ? [...lifeforms, Math.random()]
            : lifeforms;
        });
      }
    }, 1000 * multipliers);
    intervalRef.current = interval;
    return () => {
      clearInterval(interval);
    };
  }, [isScanningForLifeForms, config, soughtLifeformCount]);

  /**
   * Update the page title with the number of found lifeforms when the array chnges
   */
  useEffect(() => {
    document.title = "Found lifeforms: " + foundLifeforms.length;
  }, [foundLifeforms]);

  /**
   * Set the config in local storage
   */
  useEffect(() => {
    localStorage.setItem("__tricorder__configuration", JSON.stringify(config));
  }, [config]);

  /*
   * Load the configuration from local storage, then set it in state
   */
  useEffect(() => {
    const newConfiguration = JSON.parse(
      localStorage.getItem("__tricorder_configuration") ?? "{}"
    );
    setConfig(newConfiguration);
  }, []);

  return (
    <div>
      <Counter count={foundLifeforms.length} />
      <CheckNumberOfLifeformsIsCorrect lifeforms={foundLifeforms} />
      <ConfigurationDisplay config={config} />
      <div>
        <Configure
          config={config}
          onChange={(key, value) =>
            setConfig((oldConfig) => ({ ...oldConfig, [key]: value }))
          }
        />
      </div>
      <button
        className="m-4 p-4 rounded-full bg-red-900 font-bold text-white"
        onClick={() => {
          if (isScanningForLifeForms && intervalRef) {
            setIsScanningForLifeforms(false);
            clearInterval(intervalRef.current);
          } else if (!isScanningForLifeForms) {
            setIsScanningForLifeforms(true);
          }
        }}
      >
        Scan for a new lifeform every 1000ms?
      </button>
      <button
        className="m-4 p-4 rounded-full bg-red-900 font-bold text-white"
        onClick={() => {
          setFoundLifeForms([]);
        }}
      >
        Clear found lifeforms
      </button>
      <div>
        {isScanningForLifeForms ? (
          <span className="font-bold mb-8">SCANNING FOR LIFE FORMS</span>
        ) : (
          "Not scanning for lifeforms"
        )}
      </div>
      <div>
        <h4>Lifeforms Found</h4>
      </div>
      <div>
        <ul>
          {foundLifeforms.map((lifeform, idx) => (
            <li key={idx}>
              {idx}: {lifeform}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CheckNumberOfLifeformsIsCorrect({
  lifeforms,
}: {
  lifeforms: number[];
}) {
  return lifeforms.length === 47 ? (
    <div className="text-3xl text-green-700 p-64">47 lifeforms found!</div>
  ) : (
    <></>
  );
}

export default Tricorder;
