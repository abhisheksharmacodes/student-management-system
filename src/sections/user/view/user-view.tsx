// @ts-nocheck

import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
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
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { RadioGroup, FormControlLabel, Radio, MenuItem, Checkbox, Slider } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

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
  const { handleSubmit, control, formState: { errors } } = useForm();
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
        const data2 = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          fullName: doc.data().fullName,
          classNumber: doc.data().classNumber,
          section: doc.data().section,
          rollNumber: doc.data().rollNumber,
          // Add other fields as necessary
        }));
        console.log('Data fetched: ', data2);
        setData(data2);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };

    fetchData();
  }, [data]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  }).sort((a, b) => a.id - b.id);

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
            console.log(formData.gender);
            try {
              const docRef = await addDoc(collection(db, 'users'), {
                id: 1001 + data.length,
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
              console.log('Document written with ID: ', docRef.id);
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
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
                    id={row.id}
                    key={row.id}
                    name={row.fullName}
                    classNumber={row.classNumber}
                    section={row.section}
                    rollnumber={row.rollNumber}
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