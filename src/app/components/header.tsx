
import SupabaseListener from "@/app/components/supabase-listener";
import Link from 'next/link'
import ModeSwitch from "./modeSwitch";

const Header = () => {
  return (
    <header className='flex flex-row justify-between py-2 px-2 mx-auto max-w-screen-sm items-center'>
        <Link href="/">
        <h1 className=' text-md font-medium '>N式家計簿</h1>
        </Link>
        <SupabaseListener />
    </header>
  )
}

export default Header
