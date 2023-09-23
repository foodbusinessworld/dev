import { Empty } from "antd"

const NoDataFound = (props:any) => {
    return (<>
        <div className="mt-30">
            <Empty description={false} />
            <p className='nodata'>{props.message}</p>
        </div>
    </>)
}

export default NoDataFound;