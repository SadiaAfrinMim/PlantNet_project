import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../API/utils'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'


const AddPlant = () => {
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()
  const [loading,setLoading] = useState(false)
  const [uploadImage, setUploadImage] = useState({
    image: { name: 'Upload Button' },
  })

  // const [uploadButtonText,setUploadButtonText]=useState({name: 'Upload Button'})
 
  const handleSubmit =async e=>{
    e.preventDefault()
    setLoading(true)
    const form = e.target
    const name = form.name.value
    const description = form.description.value
    const category = form.category.value
    const price = parseFloat(form.price.value)
    const quantity = parseInt(form.quantity.value)
    const image = form.image.files[0]
    const imageUrl = await imageUpload(image)


    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email

    }

    // plant data object
    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageUrl,
      seller,
    }
    console.log(plantData)
    try{
      const {data}= await axiosSecure.post('/plants',plantData)
      toast.success("Data Added Successfully")

    }
    catch(err){
      console.log(err)

    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm  handleSubmit={handleSubmit} loading={loading}  uploadImage={uploadImage} setUploadImage={setUploadImage}/>
    </div>
  )
}

export default AddPlant
