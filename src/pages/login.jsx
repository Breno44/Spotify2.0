import { getProviders, signIn } from 'next-auth/react'

export default function Login({ providers }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img src="https://links.papareact.com/9xl" className="mb-5 w-52" />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="rounded-full bg-[#18D860] p-5 text-white"
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            Login with {provider.name}{' '}
          </button>
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}
