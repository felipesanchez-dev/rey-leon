interface IconProps extends React.SVGProps<SVGSVGElement> {
  iconOnly?: boolean;
}

export default function Logo({ iconOnly = false, ...props }: IconProps) {
  return (
    <>
      <img src="/Logo.png" alt="Rey Leon" />
    </>
  );
}
