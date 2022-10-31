import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { signInAnon, getUser } from "../firebase/auth";

const Home = () => {

    const [ signedIn, setSignedIn ] = useState();

    const [ roomName, setRoomName ] = useState();
    const [ rooms, setRooms ] = useState([]);

    const user = useSelector(state => state.user.user);

    useEffect(() => {
        fetch('/api/rooms/getRooms')
            .then((res) => res.json())
            .then((data) => {
                setRooms([]);

                data.rooms.forEach((room) => {
                    setRooms(val => [...val, room])
                })
            });
        
        if (user) setSignedIn(true);
        
    }, [user])

    const handleStart = async (e) => {
        const signIn = signInAnon();

        signIn.then(() => {
            if (signIn) setSignedIn(true);
        });
    }

    const handleCreateRoom = (e) => {

        fetch('/api/rooms/addRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomName: roomName,
                dateCreated: new Date()
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log("Room created");
                    setRoomName("");
                }
            })
    }


    return (
        <div className="w-fit mx-auto flex flex-col h-screen">
            <div className='mt-10 mb-10'>
                <p className='text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#DC2424] to-[#4A569D]'>Party Chat App</p>
                <p className='text-xl'>
                by <a className='group transition-all duration-300 ease-in-out font-bold text-blue-600' href='https://jabeztorre.ga' target="_blank" rel="noreferrer">
                    <span className='bg-left-bottom bg-gradient-to-r from-blue-500 to-blue-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out'>
                    Jabez Torre
                    </span>
                </a>
                </p>
            </div>

            <div className="w-3/12">

                <div>
                    <div className='mt-3'>
                        <label htmlFor="name">Your name</label>
                        <input name="name" className='w-fit h-10 px-2 border border-[#222222] rounded-md' type="textarea"></input>
                    </div>
                    {/* <div className='mt-3'>
                        <label htmlFor="peer-id">Enter Room ID</label>
                        <input name="peer-id" className='w-fit h-10 px-2 border border-[#222222] rounded-md' type="textarea"></input>
                    </div> */}
                </div>

                {/* <div>
                    <div className='mt-3'>
                        <label htmlFor="name">Room Name</label>
                        <input value={roomName} onChange={(e) => setRoomName(e.target.value)} name="name" className='w-fit h-10 px-2 border border-[#222222] rounded-md' type="textarea"></input>
                    </div>
                </div> */}

                <div className="w-max space-x-2 flex">
                    <button className='mt-5 bg-[#222222] text-white p-2 rounded-lg' onClick={handleStart}>Start Looking</button>
                    {signedIn
                        ? <button className=' mt-5 bg-[#222222] text-white p-2 rounded-lg' onClick={handleCreateRoom}>Create New Room</button>
                        : <div></div>
                    }
                </div>
            </div>

            { signedIn
                ? <div className="my-5 w-full">
                    <p className="text-xl font-bold text-start">Explore other public chatrooms</p>

                    <div className="mt-3 flex flex-col space-y-3">
                        { rooms.map((room, i) => <Link key={i} href={`/chat?room=${room.id}`}>
                            <div className="hover:pointer outline outline-1 outline-[#a5a5a5] rounded-lg px-3 py-4">
                                <p className="font-bold">{room.roomName}</p>
                                <p>0/0</p>
                            </div>
                        </Link>) }
                    </div>
                </div>
                : <div></div>
            }
        </div>
    );
}

export default Home;