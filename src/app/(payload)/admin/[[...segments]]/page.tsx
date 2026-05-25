import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: { segments: string[] }
  searchParams: { [key: string]: string | string[] }
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ params, searchParams, importMap })

export default function Page({ params, searchParams }: Args) {
  return RootPage({ params, searchParams, importMap })
}
