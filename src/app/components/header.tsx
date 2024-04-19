import SupabaseListener from "./SupabaseListener";
import Link from "next/link";


const Header = () => {
  return (
    <header className="flex flex-row justify-between py-2 px-2 mx-auto max-w-screen-sm min-w-[375px]
      items-center">
      <Link href="/">
        <h1 className=" text-md font-medium ">N式家計簿</h1>
      </Link>
      <SupabaseListener />
    </header>
  );
};

export default Header;
