import { useState } from "react";
import React from 'react';

function Sidebar({ setSelectedView }) {
    const [selectedItem, setSelectedItem] = useState('dashboard');
    const [openDropdown, setOpenDropdown] = useState("");



    const handleItemClick = (item) => {
        setSelectedItem(item);
        setSelectedView(item);
    };
    const productier = () => {
        toggleDropdown('product')
    }

    const toggleDropdown = (dropdown) => {
        if (openDropdown === dropdown) {
            setOpenDropdown("");
        } else {
            setOpenDropdown(dropdown);
        }
    };

    return (

        <div className='w-[350px] bg-[#347928] h-full justify-center items-center content-center'>
            <div className="">
                <button onClick={() => handleItemClick('dash')} className={`flex hover:pl-16 text-left w-full  hover:bg-[#2d6823] pl-12 py-3 transition-all duration-200
                ${selectedItem === 'sales' ? 'bg-[#2d6823]' : ''}`}>
                    <div className='flex '>
                        <div className='flex justify-center content-center items-center align-middle px-2 text-white' >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                            </svg>





                        </div>
                        <div
                            className='text-lg  text-[#FFFBE6] '
                        >
                            Home
                        </div>
                    </div>

                </button>
                <button onClick={() => handleItemClick('sale')} className={`flex hover:pl-16 text-left w-full  hover:bg-[#2d6823] pl-12 py-3 transition-all duration-200
                    ${selectedItem === 'sales' ? 'bg-[#2d6823]' : ''}`}>
                    <div className='flex '>
                        <div className='flex justify-center content-center items-center align-middle px-2 text-white' >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clip-rule="evenodd" />
                            </svg>




                        </div>
                        <div
                            className='text-lg  text-[#FFFBE6] '
                        >
                            Sales
                        </div>
                    </div>

                </button>
                <div>

                        <button
                            onClick={() => productier()}
                            className="flex hover:pl-16 text-left w-full pl-12 py-3 transition-all hover:bg-[#2d6823] duration-200"
                        >
                            <div className='flex '>
                                <div className='flex justify-center content-center items-center align-middle px-2 text-white' >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                    <path fill-rule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                                </svg>



                                </div>
                                <div
                                    className='text-lg  text-[#FFFBE6] '
                                >
                                    Product
                                </div>
                            </div>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === "product" ? "max-h-40" : "max-h-0"
                                }`}
                        >
                            <button onClick={() => handleItemClick('productadd')}
                                className={`text-lg  text-[#FFFBE6] block py-3 text-left w-full px-4 pl-24 hover:pl-28 transition-all duration-200 hover:bg-[#2d6823]
                                ${selectedItem === 'productadd' ? 'bg-[#2d6823]' : ''}`}>
                                <div className="flex content-center items-center">
                                    <div className='flex justify-center content-center items-center align-middle px-2 text-white' >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                            <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
                                            <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
                                            <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                                        </svg>
                                    </div>
                                    <div
                                        className='text-lg  text-[#FFFBE6] '
                                    >
                                        Change or add
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => handleItemClick('productlist')}
                                className={`text-lg  text-[#FFFBE6] block py-3 text-left w-full px-4 pl-24 hover:pl-28 transition-all duration-200 hover:bg-[#2d6823]
                                    ${selectedItem === 'productlist' ? 'bg-[#2d6823]' : ''}`}>
                                <div className="flex content-center items-center px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 mr-2">
                                        <path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" />
                                        <path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                                    </svg>


                                    <div className="text-lg">List</div>

                                </div>
                            </button>
                        </div>
                    </div>

            </div>
        </div>
    );
}

export default Sidebar;
