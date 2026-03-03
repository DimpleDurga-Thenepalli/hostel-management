import React, { useEffect, useState } from 'react';
import api from '../../api';

function RoomsPage() {
  const [summary, setSummary] = useState(null);
  const [searchParams, setSearchParams] = useState({
    block: 'men',
    subBlock: 'ac',
    roomNumber: '',
  });
  const [roomDetail, setRoomDetail] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [createData, setCreateData] = useState({
    block: 'men',
    subBlock: 'ac',
    roomNumber: '',
    capacity: 4,
  });
  const [error, setError] = useState('');

  const loadSummary = async () => {
    try {
      const res = await api.get('/admin/rooms/summary');
      setSummary(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSelectedBed(null);
    try {
      const res = await api.get('/admin/rooms/search', { params: searchParams });
      setRoomDetail(res.data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Room not found');
      setRoomDetail(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/admin/rooms', createData);
      setCreateData({ ...createData, roomNumber: '', capacity: 4 });
      await loadSummary();
      alert('Room created');
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to create room');
    }
  };

  return (
    <div>
      <h2>Rooms</h2>
      <p>
        Overview of Men&apos;s and Women&apos;s blocks with AC / Non-AC rooms and a visual bed
        layout.
      </p>

      {summary && (
        <div className="grid grid-4">
          <div className="card">
            <div className="card-label">Total Rooms</div>
            <div className="card-value">{summary.totalRooms}</div>
          </div>
          <div className="card">
            <div className="card-label">Occupied Rooms</div>
            <div className="card-value">{summary.occupiedRooms}</div>
          </div>
          <div className="card">
            <div className="card-label">Available Rooms</div>
            <div className="card-value">{summary.availableRooms}</div>
          </div>
          <div className="card">
            <div className="card-label">Students</div>
            <div className="card-value">{summary.totalStudents}</div>
          </div>
        </div>
      )}

      <div className="two-column">
        <div>
          <h3>Search Room Layout</h3>
          <form onSubmit={handleSearch} className="form-grid">
            <label>
              Block
              <select
                value={searchParams.block}
                onChange={(e) =>
                  setSearchParams((s) => ({ ...s, block: e.target.value }))
                }
              >
                <option value="men">Men&apos;s Block</option>
                <option value="women">Women&apos;s Block</option>
              </select>
            </label>
            <label>
              Sub Block
              <select
                value={searchParams.subBlock}
                onChange={(e) =>
                  setSearchParams((s) => ({ ...s, subBlock: e.target.value }))
                }
              >
                <option value="ac">AC</option>
                <option value="non-ac">Non-AC</option>
              </select>
            </label>
            <label>
              Room Number
              <input
                type="text"
                value={searchParams.roomNumber}
                onChange={(e) =>
                  setSearchParams((s) => ({ ...s, roomNumber: e.target.value }))
                }
                required
              />
            </label>
            <button type="submit">Search</button>
          </form>

          {error && <div style={{ marginTop: 8, color: 'red' }}>{error}</div>}

          {roomDetail && (
            <div style={{ marginTop: 16 }}>
              <h4>
                Room {roomDetail.roomNumber} - {roomDetail.block.toUpperCase()} /{' '}
                {roomDetail.subBlock.toUpperCase()}
              </h4>
              <p>
                Capacity: {roomDetail.capacity} | Occupied:{' '}
                {roomDetail.beds.filter((b) => b.occupied).length}
              </p>
              <div className="bed-layout">
                {roomDetail.beds.map((bed) => (
                  <button
                    key={bed.bedNumber}
                    type="button"
                    className={`bed ${bed.occupied ? 'occupied' : 'available'}`}
                    onClick={() => setSelectedBed(bed)}
                  >
                    {bed.bedNumber}
                  </button>
                ))}
              </div>

              {selectedBed && (
                <div className="card" style={{ marginTop: 16 }}>
                  <div className="card-label">Bed {selectedBed.bedNumber}</div>
                  {selectedBed.occupied && selectedBed.student ? (
                    <div>
                      <div>
                        <strong>Student:</strong> {selectedBed.student.name} (
                        {selectedBed.student.rollNumber})
                      </div>
                      <div>
                        <strong>Branch / Year:</strong> {selectedBed.student.branch} /{' '}
                        {selectedBed.student.year}
                      </div>
                      <div>
                        <strong>Course:</strong> {selectedBed.student.course}
                      </div>
                      <div>
                        <strong>Parent:</strong> {selectedBed.student.parentName} (
                        {selectedBed.student.parentPhone})
                      </div>
                    </div>
                  ) : (
                    <div>This bed is available.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h3>Create New Room</h3>
          <form onSubmit={handleCreate} className="form-grid">
            <label>
              Block
              <select
                value={createData.block}
                onChange={(e) =>
                  setCreateData((d) => ({ ...d, block: e.target.value }))
                }
              >
                <option value="men">Men&apos;s Block</option>
                <option value="women">Women&apos;s Block</option>
              </select>
            </label>
            <label>
              Sub Block
              <select
                value={createData.subBlock}
                onChange={(e) =>
                  setCreateData((d) => ({ ...d, subBlock: e.target.value }))
                }
              >
                <option value="ac">AC</option>
                <option value="non-ac">Non-AC</option>
              </select>
            </label>
            <label>
              Room Number
              <input
                type="text"
                value={createData.roomNumber}
                onChange={(e) =>
                  setCreateData((d) => ({ ...d, roomNumber: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Capacity (beds)
              <input
                type="number"
                min="1"
                max="8"
                value={createData.capacity}
                onChange={(e) =>
                  setCreateData((d) => ({ ...d, capacity: Number(e.target.value) }))
                }
                required
              />
            </label>
            <button type="submit">Create Room</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;

