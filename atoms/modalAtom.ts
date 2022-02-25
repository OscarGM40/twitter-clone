import {atom} from "recoil";

/* Un atom luciría asi si fuera un estado local,pero  me estaria limitando a ese componente */
// const [ modalState,setModalState] = useState(false);


export const modalState = atom<boolean>({
    key: 'modalState',
    default: false,
})

export const postIdState = atom<string>({
    key: 'postIdState',
    default: "",
})