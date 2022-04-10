import {
  ChevronDownIcon,
  DownloadIcon,
  PlayIcon,
  UserAddIcon,
  SearchIcon,
  ArrowDownIcon,
  PauseIcon,
} from '@heroicons/react/solid'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import { isPlayingState } from '../atoms/songAtom'
import { useSpotify } from '../hooks/useSpotify'
import { Songs } from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

export function Center() {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((err) => console.log('Something went wrong', err))
  }, [spotifyApi, playlistId])

  return (
    <div className="h-screen flex-grow overflow-y-scroll bg-[#111] scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
          onClick={signOut}
        >
          <img
            className="h-10 w-10 rounded-full"
            src="https://github.com/breno44.png"
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-[#111] p-8 text-white`}
      >
        <img
          className="h-56 w-56 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />

        <div>
          <p className="text-bold text-xs">PLAYLIST</p>
          <h1 className="pb-3 text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
          <p className="text-bold text-sm text-gray-400">
            {playlist?.description}
          </p>
        </div>
      </section>

      <div className="m-auto mb-4 flex h-36 w-[95%] flex-col items-center justify-between border-b border-[#333]">
        <div className="flex w-full justify-between">
          <div className="flex items-center space-x-5">
            {isPlaying ? (
              <PauseIcon
                onClick={handlePlayPause}
                className="button h-20 w-20 text-green-500"
              />
            ) : (
              <PlayIcon
                onClick={handlePlayPause}
                className="button h-20 w-20 text-green-500"
              />
            )}
            <DownloadIcon className="h-8 w-8 text-[#999]" />
            <UserAddIcon className="h-8 w-8 text-[#999]" />
          </div>
          <div className="flex items-center space-x-4">
            <SearchIcon className="h-4 w-4 text-[#999]" />
            <p className="flex items-center text-xs text-[#999]">
              Custom Order <ArrowDownIcon className="ml-2 h-4 w-4" />
            </p>
          </div>
        </div>
        <div className="mb-3 grid w-full grid-cols-2 text-sm text-[#999]">
          <p># TITLE</p>
          <div className="flex justify-between">
            <p>ALBUM</p>
            <p className="ml-36">DATE RELEASE</p>
            <p>DURATION</p>
          </div>
        </div>
      </div>

      <div>
        <Songs />
      </div>
    </div>
  )
}
