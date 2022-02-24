import { ChangeEvent, useRef, useState } from 'react'
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from '@heroicons/react/outline'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import { db, storage } from '../firebase'
import 'emoji-mart/css/emoji-mart.css'
import { BaseEmoji, EmojiData, Picker } from 'emoji-mart'
import { useSession } from 'next-auth/react'

const Input = () => {
  
  const {data:session} = useSession();

  /* local states */
  const [input, setInput] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [showEmojis, setShowEmojis] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /* references to memory address */
  const filePickerRef = useRef<HTMLInputElement>(null)

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const sendPost = async () => {
    if (loading) return
    setLoading(true)

    const docRef = await addDoc(collection(db, 'posts'), {
      id: session?.user.uid,
      username: session?.user.name,
      userImg: session?.user.image,
      tag: session?.user.tag, 
      text: input,
      timestamp: serverTimestamp(),
    })
    /* ref devuelve una referencia a la parte del Storage que le indique,en este caso a la imagen*/
    const imageRef = ref(storage, `posts/${docRef.id}/image`)

    /* si hay un file,lo subo a esa porción del Storage,despues,tras subirlo,me traigo la URL creada para la imagen y actualizo el documento agregando la propiedad image con la url a cada post */
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, 'data_url').then(async () => {
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL,
        })
      })
    }

    setLoading(false)
    setInput('')
    setSelectedFile('')
    setShowEmojis(false)
  }

  const addImageToPost = (e: ChangeEvent<HTMLInputElement>) => {
     const reader = new FileReader()
    if (e.target.files![0]) {
      reader.readAsDataURL(e.target.files![0])
    } 
    
    /* esto crea un data:URI(data:image-png;base64,data) */
     reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target!.result as string)
    }

 /* si bien URL.createObjectURL me crea un blob:http... temporal Storage me pide un data:URI */
    // URL.createObjectURL(filePickerRef.current!.files![0])
  }

  const addEmoji = (e: EmojiData) => {
    setInput(input + (e as BaseEmoji).native)
  }

  /*   const addEmoji = (e:any) => {
    let sym = e.unified.split('-')
    let codesArray: (string | number)[] = []
    sym.forEach((el:any) => codesArray.push('0x' +  el));
    
    let emoji = String.fromCodePoint(...codesArray as number[])
    setInput(input + emoji)
  } */

  return (
    <div
      className={`flex space-x-3 overflow-y-scroll border-b border-gray-700 p-3 ${loading && 'opacity-60'}`}
    >
      <img
        src={session?.user.image!}
        alt=""
        className="h-11 w-11 cursor-pointer rounded-full"
      />

      <div className="w-full divide-y divide-gray-700">
        <div className={`${selectedFile && 'pb-7'} ${input && 'space-y-2.5'}`}>
          <textarea
            value={input}
            onChange={handleTextArea}
            rows={2}
            placeholder="What's happening?"
            className=" min-h-[50px] w-full bg-transparent text-lg tracking-wide text-[#d9d9d9] placeholder-gray-500 outline-none"
          />

          {selectedFile && (
            <div className="relative">
              <div
                className="absolute top-1 left-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#15181c] bg-opacity-75 hover:bg-[#272c26]"
                onClick={() => setSelectedFile('')}
              >
                <XIcon className="h-5 text-white" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className=" max-h-80 rounded-2xl object-contain"
              />
            </div>
          )}
        </div>

        {!loading && (
          <div className="flex items-center justify-between pt-2.5 ">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current!.click()}
              >
                <PhotographIcon className="h-[24px] text-[#1d9bf0]" />
                <input
                  type="file"
                  hidden
                  ref={filePickerRef}
                  onChange={addImageToPost}
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="h-[22px] text-[#1d9bf0]" />
              </div>

              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="h-[22px] text-[#1d9bf0]" />
              </div>

              <div className="icon">
                <CalendarIcon className="h-[22px] text-[#1d9bf0]" />
              </div>

              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  // title="Pick your emoji…"
                  // emoji="point_up"
                  color="#1d9bf0"
                  showPreview={false}
                  showSkinTones={false}
                  // i18n={{ search: 'Search...' }}
                  style={{
                    position: 'absolute',
                    marginTop: '465px',
                    marginLeft: -40,
                    maxWidth: '320px',
                    borderRadius: '20px',
                  }}
                  theme="dark"
                />
              )}
            </div>

            <button
              className="rounded-full bg-[#1d9bf0] px-4 py-1.5 font-bold text-white shadow-md hover:bg-[#1a8cd8] disabled:cursor-default disabled:opacity-50 disabled:hover:bg-[#1d9bf0]"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default Input
