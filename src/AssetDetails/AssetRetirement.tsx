import { Address } from "viem";
import { Retirement } from "../modules/retirement/Retirement";
import { useEffect, useState } from "react";

export function AssetRetirement({
  retirementWallet,
}: {
  retirementWallet: Address;
}): React.ReactElement {
  const [project, setProject] = useState<any>();
  const [minimumCredits, setMinimumCredits] = useState(1);

  useEffect(() => {
    const fetchCreditDetails = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_ECOTOKEN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            celo_wallet: retirementWallet,
          }),
        });
        const data = await res.json();
        setProject(data);
        const minCredits = Math.round((0.002 / data.price) * 100) / 100;
        setMinimumCredits(minCredits);
      } catch (error) {
        console.log("Error fetching token details", error);
      }
    };

    fetchCreditDetails();
  }, []);

  return (
    <>
      {project ? (
        <Retirement
          retirementWallet={retirementWallet}
          project={project}
          minimumCredits={minimumCredits}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
