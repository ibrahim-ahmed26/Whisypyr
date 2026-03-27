import { Providers } from "../Providers";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Providers>{children}</Providers>
    </div>
  );
}
