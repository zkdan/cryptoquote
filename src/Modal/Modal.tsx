import './Modal.css'
import {PropsWithChildren, ReactNode, KeyboardEvent} from 'react';

type IModal = {
  close:()=>void;
  children:ReactNode;
}
const Modal = ({children, close}:PropsWithChildren<IModal>) => {

const checkKey =(e:KeyboardEvent<HTMLDivElement>)=>{
  if(e.key ==='Escape'){
    close()
  } 

  if(e.key === 'Tab'){
    e.preventDefault()
  }
}
return(
    <div 
      role={'dialog'} 
      aria-modal
      tabIndex={0} 
      title={'Instructions'}
      className='modal' 
      onKeyDown={checkKey} 
      onClick={close} >
      <div 
        className='modal-content'>
          <button autoFocus className='close-button' onClick={close} tabIndex={0}>x</button>
          {children}
      </div>
    </div>
)
}
export default Modal;