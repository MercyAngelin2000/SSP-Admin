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
            minHeight:  '30px'
        }
    },
    headCells: {
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            // #8b2949 
            // backgroundColor: '#762942',
            backgroundColor:'hsl(241.41deg 60.95% 58.82%)'
        },
    },
    rows: {
        style: {
            borderRadius: '10px',
            marginTop: '10px',
            borderBottom: '1px solid lightgray',
            boxShadow: "0px 3px 4px -5px grey",
            minHeight:  '5px',
            backgroundColor: '#ffff', // Background color for rows
            '&:hover': {
                // backgroundColor: '#e9ecef', // Background color for row on hover
                boxShadow: "0px 1px 6px 2px #cfcfcf",
                transform: "scaleX(1.01)",
                transition: ".5s"
            },
        },
    },
    cells: {
        style: {
            fontSize: '12px',
        },
    },
}
export function setSessionStorageItem(key, value) {
    sessionStorage.setItem(key, value);
    const event = new Event('sessionStorageChanged');
    window.dispatchEvent(event);
  }