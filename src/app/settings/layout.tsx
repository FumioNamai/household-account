'use client'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { UserCircleIcon,EnvelopeIcon,KeyIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Stack } from '@mui/material';

// セッティングス用ののナビゲーション
const subNavigation = [
  {
    name: 'プロフィール',
    icon: AccountCircleOutlinedIcon,
    href:'/settings/profile',
  },
  {
    name: 'メールアドレス',
    icon: EmailOutlinedIcon,
    href:'/settings/email',
  },
  {
    name: 'パスワード',
    icon: PasswordOutlinedIcon,
    href:'/settings/password',
  },
  {
    name: 'ログアウト',
    icon: LogoutOutlinedIcon,
    href:'/settings/logout',
  },
]

//レイアウト
const SettingsLayout = ({ children } : { children: React.ReactNode }) => {
  const pathname = usePathname() // 現在のページのパスを取得できる
  return (
    <div>
      {/* <div className="col-span-1 text-sm space-y-1 font-bold flex flex-col"> */}
        <Stack spacing={3}>
        {
          subNavigation.map((item,index) => (
            <Link href={item.href} key={index}>
              <div
              className={ `${item.href == pathname && 'bg-sky-100 text-sky-500 hover:bg-sky-100 px-3 py-2 rounded-full'}`}
              >
                <item.icon className='inline-block mr-2'></item.icon>
              {item.name}
              </div>
            </Link>
          ))
        }
        </Stack>
      {/* </div> */}
      <div>{children}</div>
    </div>
  )
}

export default SettingsLayout
