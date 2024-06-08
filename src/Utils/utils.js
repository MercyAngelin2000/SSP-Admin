export const activeStatus = (status) => {
    if (status) {
        return <div className="active-status">Active</div>
    } else {
        return <div className="inactive-status">In Active</div>

    }
}

export const tableHeaderBackground= '#bed8ff'