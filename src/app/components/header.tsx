import SupabaseListener from "@/app/components/supabase-listener";
import Link from 'next/link'


const Header = () => {
  return (
    <header className='flex flex-row justify-between py-5 px-5 mx-auto max-w-screen-sm '>
        <Link href="/">
        <h1 className=' text-xl font-medium '>N式家計簿</h1>
        </Link>
        <SupabaseListener />
    </header>
  )
}

export default Header
