
import style from './VerifyPassword.module.css'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { number, object, string } from 'yup';
import axios from 'axios';

export default function VerifyPassword() {
  const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
  
    const navigate = useNavigate();
  
    async function verifyResetCode(values) {
      setLoading(true);
      const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`, values)
        .catch((error) => {
          setLoading(false)
          const { message } = error.response.data;
          setApiError(message)
        })

        console.log(data);
        
  
      if (data.status == "Success") {
        setLoading(false);
        navigate('/resetpassword');
      }
    }
  
    const validationSchema = object({
      resetCode: string().required("Reset number is required")
    })
  
  
    const formik = useFormik({
      initialValues: {
        resetCode: ""
      }, validationSchema,
      onSubmit: verifyResetCode
  
    })
  
    useEffect(() => {
      document.body.style.backgroundColor = '#488855';
  
      return () => {
        document.body.style.backgroundColor = ''
      }
    }, [])
  
  
  
    return <>
  
      <div className="container pt-4">
        <div className={`${style.formColor} w-75 mx-auto p-4 rounded-3 shadow bg-white`}>
          <h2 className='fw-semibold'>Reset Password</h2>
          {apiError ? <div className='alert alert-danger'>{apiError}</div> : null}
          <form className='pt-3' onSubmit={formik.handleSubmit}>
  
            <label htmlFor="resetCode" className='fs-5 mt-3'>Reset Code</label>
            <input type="string" id='resetCode' onChange={formik.handleChange} onBlur={formik.handleBlur} name='resetCode' className={`${style.formControl} form-control mt-2`} />
            {formik.errors.resetCode && formik.touched.resetCode ? <div className='text-danger'>{formik.errors.resetCode}</div> : null}
  
            <div className="submitBtn text-center mt-4">
              {loading ? <PulseLoader color="#63AF18" size={15}/> : <button className="btn btn-success w-50" disabled={!(formik.dirty && formik.isValid)} type='submit'>Submit</button>
              }
            </div>
          </form>
  
        </div>
      </div>
    </>
}
