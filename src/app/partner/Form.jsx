"use client"

import React, {useRef, useState } from 'react'
import Checkbox from '../../components/Checkbox'
import Radio from '../../components/Radio'
import axios from 'axios'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'
import ReCAPTCHA from "react-google-recaptcha";



const Form = () => {
  const { register, watch, handleSubmit, setValue, reset, formState: { errors, isSubmitting }, control } = useForm()
  const gstRegisteredValue = watch('gst_registered');
  // const gstPercentageValue = watch('gst_percentage');
  const otherNotesValue = watch('other_notes');
  const [recaptchaValue, setRecaptchaValue] = useState('');
  const captchaRef = useRef()

  
  const SITE_KEY = '6LcCto0qAAAAAJxmYSdAFxUJzVeXBKkpDb9u4tiR';


  const Submit = async (data) => {
    data.preventDefault();
    captchaRef.current.reset();

    if (gstRegisteredValue === "No") {
      data.gst_percentage = "0"; // Set GST percentage to 0 when 'No' is selected
    }

    if (otherNotesValue) {
      data.other_notes = `Reference: ${otherNotesValue}`;
    }
    // console.log('Form Data:', data);
    try {
      const res = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_HOST}/api/v1/create/lead`,
        data: {...data, contact_established:'yes' },
        recaptchaValue,

      })
      // console.log(res);
      reset()
      Swal.fire({
        title: 'Thank you for submitting. Our team will get in touch with you shortly. In the meantime, you can call or WhatsApp us at:',
        icon: 'success',
        html: '<a href="https://api.whatsapp.com/send?phone=918879949404" target="_blank" style="color: #007bff; text-decoration: none;">+91-8879949404</a>',
        showConfirmButton: true,
        allowOutsideClick: true,
        confirmButtonText: "Ok"
      });
    } catch (error) {
      console.log(error);
      alert("Could not add lead")
    }
  };

  const onChange = value => {
    setRecaptchaValue(value);
  }

  const formFields = [
    {
      name: 'name',
      label: 'Your Name*',
      type: 'text',
      validation: { required: "Your name is required" },
    },
    {
      name: 'contact',
      label: 'Your Contact*',
      type: 'number',
      validation: {
        required: { value: true, message: "Your contact number is required" },
        validate: {
          isPositive: value => value > 0 || "Contact number cannot be negative",
          isValidLength: value =>
            value.toString().length >= 10 && value.toString().length <= 15 ||
            "Contact number must be between 10 to 15 digits",
        },
      },
    },
    {
      name: 'contacted_city',
      label: 'City*',
      type: 'text',
      validation: { required: "City is required" },
    },
    {
      name: 'salon_name',
      label: 'Brand / Business Name*',
      type: 'text',
      validation: { required: "Brand / Business name is required" },
    },
    {
      name: 'no_of_outlets',
      label: 'No. of Branches*',
      type: 'number',
      validation: {
        required: "No. of branches is required",
        validate: {
          positive: value => value > 0 || "Number of branches cannot be negative",
        },
      },
    },
    {
      name: 'map_link',
      label: 'Google Maps Link / Google Profile',
      type: 'text',
    },
    {
      name: 'outlet_type',
      label: 'Outlet type?',
      type: 'radio',
      options: ['Company Owned', 'Franchisee'],
      validation: { required: "Outlet type is required" },
    },
    {
      name: 'gst_registered',
      label: 'Are you GST registered?',
      type: 'radio',
      options: ['Yes', 'No'],
      validation: { required: "This field is required" },
    },
    {
      name: 'partner_type',
      label: 'Services you provide (select 1 or more)',
      type: 'checkbox',
      options: [
        'Salon',
        'Wellness & Spa',
        'Dermatology Clinic',
        'Nails & Lashes',
        'Pet Spa',
        'Tattoo & Piercing',
      ],
      validation: { required: "Select at least one" },
    },
    {
      name: 'other_notes',
      label: 'How did you hear about us? (Optional)',
      type: 'radio',
      options: ['Google', 'Facebook/Instagram', 'Your Customer', 'Industry Friends'],
    },
  ];

  return (
    <div className='mb-[100px] mt-6  max-w-[1200px] mx-auto'>
      <h2 className='font-medium text-[20px] sm:text-[30px] font-semibold mb-4 pl-5'>Want to partner with us</h2>
      {/* <p className='mb-2 text-[#707070] text-center'>(All fields are mandatory)</p> */}


      <form onSubmit={handleSubmit(Submit)} className='mx-[22px] text-[16px] flex flex-col gap-[14px]'>
        {formFields.map((field, index) => (
          <div key={index}>
            {(field.type === 'text' || field.type === 'number') && (
      <div className="relative w-full">
        <input
          type={field.type}
          {...register(field.name, {
            ...field.validation,
            validate: value =>
              field.type === 'number' && value < 0
                ? "Negative values are not allowed"
                : true, // Custom validation rule for negative values
          })}
          name={field.name}
          id={field.name}
          placeholder=" " // Keep the placeholder empty to trigger the floating label
          min={field.type === 'number' ? 0 : undefined} // Prevent negative values for number inputs
          className={`block px-2.5 pb-2.5 pt-4 w-full sm:w-[70%] text-base text-gray-900 bg-transparent border ${
            errors[field.name] ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:border-blue-600 focus:ring-0 focus:outline-none peer`}
        />
        <label
          htmlFor={field.name}
          className={`absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-placeholder-shown:left-3 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4`}
        >
          <span className="sm:text-[16px] text-[14px]">{field.label}</span>
        </label>
        {(errors[field.name] || errors["salon_contacts"]) && (
          <p className="text-red-500 text-sm mt-1">
            {errors[field.name]?.message || errors["salon_contacts"][field.name.split(".").pop()]?.message}
          </p>
        )}
      </div>
              )}

            {field.type === 'radio' && field.name !== 'gst_registered' && (
              <label className='flex flex-col gap-[12px]'>
                <span className='font-semibold'>{field.label}</span>
                {field.options.map((option, i) => (
                  <div key={i}>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={field.validation}
                      render={({ field: { onChange, value } }) => (
                        <Radio
                          isChecked={value === option}
                          label={option}
                          name={field.name}
                          value={option}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                ))}
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>}
              </label>
            )}

            {field.type === 'checkbox' &&
              <label className='flex flex-col gap-[12px]'>
                <span><span className='font-semibold'>{field.label}</span></span>
                {field.options.map((option, i) => (
                  <Controller
                    key={i}
                    name={field.name}
                    control={control}
                    rules={field.validtion}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        isChecked={value ? value.includes(option) : false}
                        label={option}
                        value={option}
                        onChange={e => {
                          const newValue = e.target.checked
                            ? [...(value || []), option]
                            : (value || []).filter(v => v !== option);
                          onChange(newValue);
                        }}
                      />
                    )}
                  />
                ))}
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>}
              </label>
            }

            {field.type === 'radio' && field.name === 'gst_registered' && (
              <div className='flex flex-col gap-[12px]'>
                <span className='font-semibold'>{field.label}</span>
                {field.options.map((option, i) => (
                  <div key={i}>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={field.validation}
                      render={({ field: { onChange, value } }) => (
                        <Radio
                          isChecked={value === option}
                          label={option}
                          name={field.name}
                          value={option}
                          // onChange={onChange}
                          onChange={(e) => {
                            onChange(e);
                            if (e.target.value === "No") {
                              setValue('gst_percentage', '0');
                            }
                          }}
                        />
                      )}
                    />
                    {option === 'Yes' && gstRegisteredValue === 'Yes' && (
                      <div className='mt-2 ml-8'>
                        <label className='flex flex-col gap-[12px]'>
                          <span className='font-semibold'>Select Percentage:</span>
                          <div>
                            <Controller
                              name="gst_percentage"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Radio
                                  isChecked={value === '6.00'}
                                  label="6%"
                                  name="gst_percentage"
                                  value="6.00"
                                  onChange={onChange}
                                />
                              )}
                            />
                          </div>
                          
                          <div>
                            <Controller
                              name="gst_percentage"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Radio
                                  isChecked={value === '18.00'}
                                  label="18%"
                                  name="gst_percentage"
                                  value="18.00"
                                  onChange={onChange}
                                />
                              )}
                            />
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
                {/* Ensure error message is displayed for gst_registered */}
                {errors['gst_registered'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['gst_registered'].message}</p>
                )}
              </div>
            )}


          </div>
        ))}

        <div>
          <ReCAPTCHA
            sitekey={SITE_KEY}
            onChange={onChange}
            ref={captchaRef}
          />

        </div>

        <button type="submit" className='bg-[#72B5EC] text-white font-semibold text-[16px] px-[50px] py-[15px] w-full sm:w-[70%] rounded-lg flex justify-center'>
          {
            isSubmitting ? <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg> :
              "Submit"
          }
        </button>
      </form>

    </div>
  )
}

export default Form;
