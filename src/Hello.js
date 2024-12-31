import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery'; // Import jQuery explicitly
import DataTableComponent from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'bootstrap/dist/css/bootstrap.min.css';

DataTableComponent.use(DT);

function Hello() {
    const tableRef = useRef(null);
    const [data, setData] = useState([]);

    // Fetch data from API
    useEffect(() => {
        fetch('/data.json')
            .then((response) => response.json())
            .then((json) => {
                setData(json.data); // Set the data to state
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Initialize DataTable after data is fetched
    useEffect(() => {
        if (tableRef.current && data.length) {
            const columns = Object.keys(data[0]).map((key) => ({
                data: key,
                title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), // Capitalize first letter and replace underscores with spaces
            }));

            // Clear thead to prevent duplicate headers
            const thead = $(tableRef.current).find('thead');
            thead.empty(); // Clear existing headers

            // Initialize DataTable
            const table = $(tableRef.current).DataTable({
                data: data, // Use the fetched data
                columns: columns, // Use dynamically generated columns
                responsive: true, // Make the table responsive
                destroy: true, // Destroy previous instance before reinitializing
                initComplete: function () {
                    const api = this.api();

                    // Add a new row for search inputs below the headers
                    let searchRow = $('<tr>').appendTo(thead);

                    api.columns().every(function () {
                        const column = this;

                        // Create a search input field for each column
                        const input = $('<input type="text" class="form-control" placeholder="Search">')
                            .on('keyup change', function () {
                                column.search($(this).val()).draw();
                            });

                        // Append the search input field to the search row
                        $('<th>').append(input).appendTo(searchRow);
                    });
                },
            });
        }
    }, [data]); // Re-run effect when data changes

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h3>Datatable Example</h3>
                        </div>
                        <div className="card-body">
                            <table  ref={tableRef} className="table table-bordered" style={{ width: '100%' }}>
                                <thead></thead> {/* Header and search rows will be generated dynamically */}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hello;
