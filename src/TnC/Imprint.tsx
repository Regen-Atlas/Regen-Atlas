import { SimplePage } from "../shared/components/SimplePage";

export const Imprint: React.FC = () => {
  return (
    <SimplePage>
      <div className="prose">
        <h1>Imprint</h1>
        <p>
          <strong>Regen Atlas</strong> is a project by{" "}
          <strong>CL Cybernetix GmbH</strong>.
        </p>
        <p>
          CL Cybernetix GmbH
          <br />
          Engeldamm 64b
          <br />
          10179 Berlin
        </p>
        <a href="mailto:contact@curvelabs.eu">contact@curvelabs.eu</a>
      </div>
    </SimplePage>
  );
};
