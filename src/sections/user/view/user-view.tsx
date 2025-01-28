// @ts-nocheck

import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, getAuth } from 'firebase/auth';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { RadioGroup, FormControlLabel, Radio, MenuItem, Checkbox, Slider, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import { db, auth } from '../../../firebase-config'; // Ensure you have firebase-config file

// ----------------------------------------------------------------------

export function UserView() {
  const navigate = useNavigate();
  const table = useTable();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { handleSubmit, control, formState: { errors }, reset } = useForm();
  const [filterName, setFilterName] = useState('');
  const [data, setData] = useState<UserProps[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/sign-in');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const data2 = querySnapshot.docs.map((doc2) => ({
          id: doc2.id,
          fullName: doc2.data().fullName,
          classNumber: doc2.data().classNumber,
          section: doc2.data().section,
          rollNumber: doc2.data().rollNumber,
          studentId: doc2.data().studentId,
        }));
        setData(data2);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };

    fetchData();
  }, [data]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = async (id) => {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSelectedStudent({ id, ...docSnap.data() });
      reset(docSnap.data());
      setEditOpen(true);
    } else {
      console.log('No such document!');
    }
  };

  const handleEditClose = () => setEditOpen(false);

  const handleViewOpen = async (id) => {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSelectedStudent(docSnap.data());
      setViewOpen(true);
    } else {
      console.log('No such document!');
    }
  };

  const handleViewClose = () => setViewOpen(false);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setData(data.filter((student) => student.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const dataFiltered: UserProps[] = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  }).sort((a, b) => a.studentId - b.studentId);

  const notFound = !dataFiltered.length && !!filterName;

  const paginatedData = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Students
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          Add student
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" mb={2}>Add Student</Typography>
          <form onSubmit={handleSubmit(async (formData) => {
            // Perform form submission logic here
            try {
              const docRef = await addDoc(collection(db, 'users'), {
                studentId: 1001 + data.length,
                fullName: formData.fullName,
                dob: formData.dob,
                gender: formData.gender,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                classNumber: formData.classNumber,
                section: formData.section,
                studyHours: formData.studyHours,
                languages: formData.languages,
                learningGoals: formData.learningGoals,
                rollNumber: formData.rollNumber
              });
            } catch (error) {
              console.error('Error adding document: ', error);
            }
            handleClose();
          })}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ '@media (max-width: 840px)': { flexDirection: 'column' } }}>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Full Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      margin="normal"
                      error={!!errors.fullName}
                      helperText={errors.fullName ? errors.fullName.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="dob"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Date of Birth is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dob}
                      helperText={errors.dob ? errors.dob.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginTop: '10px' }}>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Box>
                      <Typography>Gender</Typography>
                      <RadioGroup {...field} row>
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                      {errors.gender && <Typography color="error" style={{ fontSize: '12px', marginLeft: '15px' }}>{errors.gender.message}</Typography>}
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      margin="normal"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Phone Number is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      type="tel"
                      margin="normal"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      error={!!errors.address}
                      helperText={errors.address ? errors.address.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="classNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Class Number is required',
                    validate: value => value <= 12 || 'Class Number cannot be more than 12'
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Class"
                      fullWidth
                      type="number"
                      margin="normal"
                      error={!!errors.classNumber}
                      helperText={errors.classNumber ? errors.classNumber.message : ''}
                      inputProps={{ max: 12 }}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="section"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Section is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Section"
                      select
                      fullWidth
                      margin="normal"
                      error={!!errors.section}
                      helperText={errors.section ? errors.section.message : ''}
                    >
                      {['A', 'B', 'C'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginTop: '10px' }}>
                <Controller
                  name="studyHours"
                  control={control}
                  defaultValue={0}
                  rules={{ required: 'Study Hours is required' }}
                  render={({ field }) => (
                    <Box>
                      <Typography>Hours of Study</Typography>
                      <Slider
                        {...field}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={9}
                        error={!!errors.studyHours}
                      />
                      {errors.studyHours && <Typography color="error">{errors.studyHours.message}</Typography>}
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginTop: '10px' }}>
                <Controller
                  name="languages"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: 'At least one language is required' }}
                  render={({ field }) => (
                    <Box>
                      <Typography>Languages</Typography>
                      {['English', 'Hindi', 'Other'].map((language) => (
                        <FormControlLabel
                          key={language}
                          control={<Checkbox
                            checked={field.value.includes(language)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, language]
                                : field.value.filter((val: string) => val !== language);
                              field.onChange(newValue);
                            }}
                          />}
                          label={language}
                        />
                      ))}
                      {errors.languages && <Typography color="error" style={{fontSize:'12px'}}>{errors.languages.message}</Typography>}
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="learningGoals"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Learning Goals are required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Learning Goals"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      error={!!errors.learningGoals}
                      helperText={errors.learningGoals ? errors.learningGoals.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginBottom: '15px' }}>
                <Controller
                  name="rollNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Roll Number is required'
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Roll Number"
                      fullWidth
                      type="number"
                      margin="normal"
                      error={!!errors.rollNumber}
                      helperText={errors.rollNumber ? errors.rollNumber.message : ''}
                    />
                  )}
                />
              </Box>
            </Box>
            <Button type="submit" style={{ marginTop: '10px' }} variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={editOpen} onClose={handleEditClose}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" mb={2}>Edit Student Details</Typography>
          <form onSubmit={handleSubmit(async (formData) => {
            // Perform form submission logic here
            try {
              const docRef = doc(db, 'users', selectedStudent.id);
              await updateDoc(docRef, {
                fullName: formData.fullName,
                dob: formData.dob,
                gender: formData.gender,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                classNumber: formData.classNumber,
                section: formData.section,
                studyHours: formData.studyHours,
                languages: formData.languages,
                learningGoals: formData.learningGoals,
                rollNumber: formData.rollNumber
              });
            } catch (error) {
              console.error('Error updating document: ', error);
            }
            handleEditClose();
          })}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ '@media (max-width: 840px)': { flexDirection: 'column' } }}>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Full Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      margin="normal"
                      error={!!errors.fullName}
                      helperText={errors.fullName ? errors.fullName.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="dob"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Date of Birth is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dob}
                      helperText={errors.dob ? errors.dob.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginTop: '10px' }}>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Box>
                      <Typography>Gender</Typography>
                      <RadioGroup {...field} row>
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                      {errors.gender && <Typography color="error" style={{ fontSize: '12px', marginLeft: '15px' }}>{errors.gender.message}</Typography>}
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      margin="normal"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Phone Number is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      type="tel"
                      margin="normal"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      error={!!errors.address}
                      helperText={errors.address ? errors.address.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="classNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Class Number is required',
                    validate: value => value <= 12 || 'Class Number cannot be more than 12'
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Class"
                      fullWidth
                      type="number"
                      margin="normal"
                      error={!!errors.classNumber}
                      helperText={errors.classNumber ? errors.classNumber.message : ''}
                      inputProps={{ max: 12 }}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="section"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Section is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Section"
                      select
                      fullWidth
                      margin="normal"
                      error={!!errors.section}
                      helperText={errors.section ? errors.section.message : ''}
                    >
                      {['A', 'B', 'C'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginTop: '10px' }}>
                <Controller
                  name="studyHours"
                  control={control}
                  defaultValue={0}
                  rules={{ required: 'Study Hours is required' }}
                  render={({ field }) => (
                    <Box>
                      <Typography>Hours of Study</Typography>
                      <Slider
                        {...field}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={9}
                        error={!!errors.studyHours}
                      />
                      {errors.studyHours && <Typography color="error">{errors.studyHours.message}</Typography>}
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginTop: '10px' }}>
                <Controller
                  name="languages"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: 'At least one language is required' }}
                  render={({ field }) => (
                    <Box>
                      <Typography>Languages</Typography>
                      {['English', 'Hindi', 'Other'].map((language) => (
                        <FormControlLabel
                          key={language}
                          control={<Checkbox
                            checked={field.value.includes(language)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, language]
                                : field.value.filter((val: string) => val !== language);
                              field.onChange(newValue);
                            }}
                          />}
                          label={language}
                        />
                      ))}
                      {errors.languages && <Typography color="error">{errors.languages.message}</Typography>}
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }}>
                <Controller
                  name="learningGoals"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Learning Goals are required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Learning Goals"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      error={!!errors.learningGoals}
                      helperText={errors.learningGoals ? errors.learningGoals.message : ''}
                    />
                  )}
                />
              </Box>
              <Box width={{ xs: '100%', md: '48%' }} style={{ marginBottom: '15px' }}>
                <Controller
                  name="rollNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Roll Number is required'
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Roll Number"
                      fullWidth
                      type="number"
                      margin="normal"
                      error={!!errors.rollNumber}
                      helperText={errors.rollNumber ? errors.rollNumber.message : ''}
                    />
                  )}
                />
              </Box>
            </Box>
            <Button type="submit" style={{ marginTop: '10px' }} variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" mb={2}>Student Details</Typography>
          {selectedStudent && (
            <Table>
              <TableBody>
              <TableRow>
                <TableCell><strong>Full Name:</strong></TableCell>
                <TableCell>{selectedStudent.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Date of Birth:</strong></TableCell>
                <TableCell>{selectedStudent.dob}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Gender:</strong></TableCell>
                <TableCell>{selectedStudent.gender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Email:</strong></TableCell>
                <TableCell>{selectedStudent.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Phone Number:</strong></TableCell>
                <TableCell>{selectedStudent.phoneNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Address:</strong></TableCell>
                <TableCell>{selectedStudent.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Class:</strong></TableCell>
                <TableCell>{selectedStudent.classNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Section:</strong></TableCell>
                <TableCell>{selectedStudent.section}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Study Hours:</strong></TableCell>
                <TableCell>{selectedStudent.studyHours}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Languages:</strong></TableCell>
                <TableCell>{selectedStudent.languages.join(', ')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Learning Goals:</strong></TableCell>
                <TableCell>{selectedStudent.learningGoals}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Roll Number:</strong></TableCell>
                <TableCell>{selectedStudent.rollNumber}</TableCell>
              </TableRow>
              </TableBody>
            </Table>
          )}
        </Box>
      </Modal>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    data.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'class', label: 'Class', align: 'center' },
                  { id: 'section', label: 'Section', align: 'center' },
                  { id: 'roll_no', label: 'Roll Number', align: 'center' },
                  { id: 'action', label: 'Action', align: 'center' }
                ]}
              />
              <TableBody>
                {paginatedData.map((row: any) => (
                  <UserTableRow
                    id={row.studentId}
                    key={row.id}
                    name={row.fullName}
                    classNumber={row.classNumber}
                    section={row.section}
                    rollnumber={row.rollNumber}
                    actions={<>
                      <IconButton onClick={() => handleViewOpen(row.id)}>
                        <Iconify icon="eva:eye-outline" />
                      </IconButton>
                      <IconButton onClick={() => handleEditOpen(row.id)}>
                        <Iconify icon="eva:edit-outline" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </>
                    }
                  />
                ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={data.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}