//This is my about pagae file!

import {useState, useEffect} from 'react'
import axios from 'axios'
// Async function call that we learned in class
const About = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // I will use the same backend pattern as MEssages.jsx
                const response = await axios.get(`${import.meta.env.VITE_SERVER_HOSTNAME}/about`)
                setData(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    // again same pattern as existing .jsx files in the backend
    if (data == null) {
        return <p>Loading</p>
    }
    return (
        <div>
            <h1>{data?.title}</h1>
            {data.paragraphs.map(paragraph => (
                <p>{paragraph}</p>
            ))}
            <img src={data.imageUrl} alt="About" />
        </div>
    )
}

export default About