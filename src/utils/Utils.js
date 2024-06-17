export const activeStatus = (status) => {
    if (status) {
        return <div className="active-status">Active</div>
    } else {
        return <div className="inactive-status">In Active</div>

    }
}

// export const tableHeaderBackground= '#1eaeca63'
export const tableStyle = {
    headRow: {
        style:{
            minHeight:  '45px'
        }
    },
    headCells: {
        style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff',
            // #8b2949 
            backgroundColor: '#762942',
        },
    },
    rows: {
        style: {
            borderRadius: '10px',
            marginTop: '10px',
            borderBottom: '1px solid lightgray',
            boxShadow: "0px 3px 4px -5px grey",
            minHeight:  '45px',
            backgroundColor: '#ffff', // Background color for rows
            '&:hover': {
                // backgroundColor: '#e9ecef', // Background color for row on hover
                boxShadow: "0px 9px 4px -6px grey",
                transform: "scaleX(1.01)",
            },
        },
    },
    cells: {
        style: {
            fontSize: '13px',
        },
    },
}