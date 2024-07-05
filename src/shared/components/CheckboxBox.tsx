import clsx from "clsx";

export const CheckboxBox = ({
  checked,
  className,
}: {
  checked: boolean;
  className?: string;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        "w-6 h-6 border-[1px] border-white rounded-lg bg-slate-50",
        "flex justify-center items-center",
        checked && "!bg-blue-950",
        className && className
      )}
    ></div>
  );
};
