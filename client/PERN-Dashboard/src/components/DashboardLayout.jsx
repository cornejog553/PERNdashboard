import Sidebar from './Sidebar'

export default function DashboardLayout(){
    return(
        <>
            <div className="grid grid-cols-[300px_1fr] h-screen">
                <Sidebar />
                <div>2</div>
            </div>
        </>
    )
}