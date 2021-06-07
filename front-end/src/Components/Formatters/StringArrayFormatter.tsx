export default function StringArrayFormatter({ arr }: { arr: string[] }) {
    return <>{arr.join(", ")}</>;
  }