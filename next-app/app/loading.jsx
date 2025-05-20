import BeatLoader from "react-spinners/BeatLoader";
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">

    <BeatLoader color="#9333ea" size={10} />
    </div>
  );
} 