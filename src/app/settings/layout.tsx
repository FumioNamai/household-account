'use client'

import { KeyIcon, ArrowLeftOnRectangleIcon, EnvelopeIcon, UserCircleIcon} from "@heroicons/react/24/solid"
import Link from "next/link"
import { usePathname } from "next/navigation"

// セッティングス用ののナビゲーション
const subNavigation = [
  {
    name: 'プロフィール',
    icon: UserCircleIcon,
    href:'/settings/profile',
  },
  {
    name: 'メールアドレス',
    icon: EnvelopeIcon,
    href:'/settings/email',
  },
  {
    name: 'パスワード',
    icon: KeyIcon,
    href:'/settings/password',
  },
  {
    name: 'ログアウト',
    icon: ArrowLeftOnRectangleIcon,
    href:'/settings/logout',
  },
]

//レイアウト
const SettingsLayout = ({ children } : { children: React.ReactNode }) => {
  const pathname = usePathname() // 現在のページのパスを取得できる
  return (
    <div>
      <div>
        {
          subNavigation.map((item,index) => (
            <Link href={item.href} key={index}>
              <div className={ `${item.href == pathname && 'bg-sky-100 text-sky-500 hover:bg-sky-100 px-3 py-2 rounded-full'}`}>
                <item.icon className='inline-block w-5 h-5 mr-2'></item.icon>
              {item.name}
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default SettingsLayout
