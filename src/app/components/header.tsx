import Link from "next/link"

const Header = () => {
  return (
    <header className="flex flex-row justify-between p-5 items-center">
    <h1 className=""><Link href='/'>N式家計簿</Link></h1>
    <div>
      <ul className="flex flex-row justify-around">
        {/* <li className="mr-2 border text-sm p-2"><Link href="/stock">在庫登録/一覧</Link></li> */}
        {/* <li className="mr-2 border text-sm p-2"><Link href="/daily">日別</Link></li> */}
        <li className="mr-2 border text-sm p-2"><Link href="/monthly">月別</Link></li>
      </ul>
    </div>
  </header>
  )
}

export default Header
