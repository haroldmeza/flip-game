import { useState, useEffect } from 'react'
import '../../App.css'
import Card, { CardElement } from './card-component'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function MainComponent(){
    const [state, setState] = useState(getArray())
    const [currentSelection, setCurrentSelection] = useState<CardElement[]>([])    
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = (_: object, reason: string) => {
        if (reason !== 'backdropClick') {                        
            setOpen(false)
        }
        
    };

    useEffect(() => {
        if(currentSelection.length < 2){
            return
        }
        const [firstElement, secondElement] = currentSelection
        if(firstElement.imageUrl !== secondElement.imageUrl){
            setTimeout(()=> {
                const newState = state.map((item: CardElement) => {
                    if(item.isFlipped){
                        return {
                            ...item,
                            isFlipped: false
                        }
                    }
                    return item
                })
                setState(newState)
                setCurrentSelection([])
            }, 2000)
            return
        }
        const newState = state.map((item: CardElement) => {
            if(currentSelection.map((s) => s.imageUrl).includes(item.imageUrl)){
                return {
                    ...item,
                    isMatched: true
                }
            }
            return item
            })
        setState(newState)
        setCurrentSelection([])             
    }, [state])

    useEffect(() => {        
        if(state.filter((e) => e.isMatched).length === 16){
           handleOpen()            
        }
    }, [state])

    const playAgain = () => {
        setOpen(false)
        setState(getArray())
    }

    const setSelection = (_: React.MouseEvent<HTMLDivElement, MouseEvent>, element: CardElement) =>{
        const { id, isMatched, isFlipped } = element
        if(isMatched || isFlipped){
            return
        }
        if(currentSelection.length == 2){
            return
        }
        setCurrentSelection((prev: CardElement[]) => [...prev, element])        
        const newState = state.map((item: CardElement) => {
            if(item.id == id){
                item = {
                    ...item,
                    isFlipped: !item.isFlipped
                }
            }
            return item
        })
        setState(newState)
    }

    return (
        <>
            <div className='grid grid-cols-4 gap-2'>
                {state.map((item: CardElement, index: number) => {
                    return <Card {...item} handleChange={setSelection} key={index}  />
                })}
            </div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Felicitaciones completaste el test
          </Typography>
          <Button onClick={playAgain} id="modal-modal-description">Jugar nuevamente</Button>          
        </Box>
      </Modal>
        </>
    )
}

function getArray(){
    const cardElementarray = createArray(16)
    return shuffleArray<CardElement>(cardElementarray)
}

function createArray(dimension: number): CardElement[]{
    const myarray: CardElement[] = []
    Array.from({ length: dimension / 8 }, (_, index) => index ).forEach((indexTop: number) => {
        Array.from({ length: 8 }, (_, index) => index ).forEach((index: number) => {
            const cardItem ={
                    id: (index + 1) + (indexTop * 8),
                    imageUrl: `${index + 1}`,
                    isFlipped: false,
                    isMatched: false,                
            }
        myarray.push(cardItem as CardElement)
        })    
    })
    return myarray;
}

function shuffleArray<T>(array: T[]): T[]{
    const shuffled = [...array]
    for(let i = shuffled.length - 1; i > 0; i -- ){
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}