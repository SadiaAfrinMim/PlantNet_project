/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Button from '../Shared/Button/Button'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useNavigate } from 'react-router-dom'

const PurchaseModal = ({ closeModal, isOpen,plant,refetch }) => {
  const navigate = useNavigate()
  // Total Price Calculation
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()
  const [totalQuantity,setTotalQuantity] = useState(1)
  const {category,description,image,price,name,seller,quantity,_id} = plant
  const [totalPrice,setTotalPrice] = useState(price)
  const [purchaseInfo,setPurchaseInfo] = useState({
    customer:{
      name:user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    plantId: _id,
    price:totalPrice,
    quantity: quantity,
    seller: seller?.email,
    address:'',
    status: 'pending'
  })
 



  const handlePurchase = async()=>{
    try{
      await axiosSecure.post('/orders',purchaseInfo)
      // decrease quantity from plants
      await axiosSecure.patch(`/plants/quantity/${_id}`,
        {quantityToUpdate: totalQuantity,
          status:'decrease'
        })
      toast.success('order successfully')
      refetch()
      navigate('/dashboard/my-orders')
      
    }
    catch(err){
      console.log(err)
    }
    finally{
      closeModal()
    }

  }

  const handleQuantity = value=>{
    if(value>quantity){
      setTotalQuantity(quantity)
     return toast.error('Quantity exist available in stock')
    }
  if(value<0){
      setTotalQuantity(quantity)
      return toast.error('quantity can not be less than 1')
    }
    setTotalQuantity(value)
    setTotalPrice(value*price)
    setPurchaseInfo(prv=>{
      return {...prv, quantity:value, price:value*price}
    })
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Plant: {name}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Category: {
category}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Price: {price}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
                </div>
                {/* quantity input field */}
                <div className='space-x-2 mt-2 text-sm'>
                <label htmlFor='quantity' className=' text-gray-600'>
                  Quantity: 
                </label>
                <input
                  className=' p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                  value={totalQuantity}
                  onChange={e=>handleQuantity(parseInt(e.target.value))}
                
                  
                  name='quantity'
                  id='quantity'
                  type='number'
                  placeholder='Available quantity'
                  required
                />
              </div>

                {/* address input field */}
                <div className='space-x-2 mt-2 text-sm'>
                <label htmlFor='address' className=' text-gray-600'>
                  Address: 
                </label>
                <input
                  className=' p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                  
                  name='address'
                  id='address'
                  onChange={e =>
                    setPurchaseInfo(prv => {
                      return {...prv, address: e.target.value }
                    })}
                  type='text'
                  placeholder='write your address'
                  required
                />
              </div>
                <div className="mt-3"><Button onClick={handlePurchase} label={`pay ${totalPrice}$`}></Button></div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal
