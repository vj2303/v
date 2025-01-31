import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const LocationSupport = () => {
  const [data, setData] = useState(null)
  const { id } = useParams()
  const getLocation = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/salon/${id.split("-")[id.split("-").length - 1]}`,
        params: {
          customerId: 518,
          latitude: "na",
          longitude: "na",
          id: id
        }
      });

      // Check if the status code is not 200 (e.g., 404 Not Found)
      // if (res.status !== 200 || res.data.status !== "Success") {
      //   throw new Error("Failed to fetch salon info");
      // }

      setData(res.data?.data.salon?.salonData?.[0].salon)

    } catch (error) {
      console.error("Error fetching salon info:", error);

      return (
        <div className='flex justify-center items-center w-full h-screen'>
          {error.response?.status === 404 ? "Salon not found (404)" : "Could not load the salon info"}
        </div>
      )
    }
  }
  useEffect(() => {
    getLocation()
  }, [])
  return (
    <div className='mt-[80px]  px-[10px]'>
      {data && <div className='flex bg-white p-2 rounded-md text-[14px] items-center justify-between'>
        <h3 className='max-w-full font-bold'>{data?.salon_name}, {data?.salon_location}</h3>
        {/* <h3 className='border-b border-blue-500 text-blue-500'>Support</h3> */}
      </div>}
    </div>
  )
}

export default LocationSupport





