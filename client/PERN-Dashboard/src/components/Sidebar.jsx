import logo from '../assets/CleaningLogo.png'
import dashboardLogo from '../assets/Dashboard logo.svg'
import bookingIcon from '../assets/Booking Icon.svg'
import customerIcon from '../assets/Customers Icon.svg'

export default function Sidebar() {
    return(
        <>
            <div className="flex flex-col bg-blue-950 text-gray-400 text-lg">
                {/* Logo */}
                <div className="flex flex-row items-center border border-solid border-b-gray-200">
                    <div>
                        <img src={logo} alt="Cleaning Crafters Logo" className="h-30 w-auto"/>
                    </div>
                    <div>Cleaning Crafters</div>
                </div>
                <div className="flex flex-row items-center gap-2 border border-solid border-b-gray-200 p-2">
                    <img src={dashboardLogo} alt="Dashboard icon"/>
                    <div>Dashboard</div>
                </div>
                <div className="flex flex-row items-center gap-2 border border-solid border-b-gray-200 p-2">
                    <img src={bookingIcon} alt="Dashboard icon"/>
                    <div>Bookings</div>
                </div>
                <div className="flex flex-row items-center gap-2 border border-solid border-b-gray-200 p-2">
                    <img src={customerIcon} alt="Dashboard icon"/>
                    <div>Customers</div>
                </div>
            </div>
        </>
    )
}