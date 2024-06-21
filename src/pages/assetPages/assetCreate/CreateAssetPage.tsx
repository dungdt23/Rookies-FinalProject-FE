import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { FC, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { NoStyleLink } from "../../../components/noStyleLink";
import { routeNames } from "../../../constants/routeName";
import { createAsset } from "../../../services/asset.service";
import {
  checkUniquePrefixName,
  createCategory,
  CreateCategoryRequest,
  fetchAllCategory,
  PrefixNameFilter,
} from "../../../services/category.service";
import { Asset, AssetState, CreateAssetRequest } from "../../../types/asset";
import { Category } from "../../../types/category";
import { ListPageState } from "../../../types/common";

const RootBox = styled(Box)(() => ({
  maxWidth: "100vh",
  margin: "auto",
}));

dayjs.locale("en");

const isPastDate = (date: Dayjs) => dayjs(date).isBefore(dayjs(), "day");

const validationSchema = yup.object({
  assetName: yup
    .string()
    .required("Please enter asset name")
    .min(2, "The asset name length should be 2-100 characters")
    .max(100, "The asset name length should be 2-100 characters"),
  categoryId: yup.string().required("Category is required"),
  installedDate: yup
    .object()
    .required("Please enter installed date")
    .test(
      "is-past-date",
      "Installed date must be in the past",
      function (value) {
        return isPastDate(value as Dayjs);
      }
    ),
  specification: yup
    .string()
    .required("Please enter specification")
    .max(500, "Specification length can't be more than 500 characters."),
  state: yup
    .number()
    .required("Please enter state")
    .oneOf(
      [AssetState.Available, AssetState.NotAvailable],
      "Invalid state value"
    ),
});

const categoryValidationSchema = yup.object({
  prefix: yup
    .string()
    .required("Please enter prefix")
    .min(2, "Prefix must be at least 2 characters")
    .max(4, "Prefix must be at most 4 characters"),
  categoryName: yup
    .string()
    .required("Please enter category name")
    .min(0, "Category Name must be at least 0 characters")
    .max(200, "Category Name must be at most 200 characters"),
});

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const CreateAssetPage: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<CreateCategoryRequest>({
    prefix: "",
    categoryName: "",
  });
  const [isUnique, setIsUnique] = useState({
    prefix: false,
    categoryName: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetchAllCategory();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoryData();
  }, []);

  const handleCreateCategoryOpen = () => {
    setOpen(true);
  };

  const handleCreateCategoryClose = () => {
    setOpen(false);
  };

  const handleCreateCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
    checkUnique({ isPrefix: name === "prefix", value });
  };

  const checkUnique = useCallback(
    debounce(async (filter: PrefixNameFilter) => {
      try {
        const response = await checkUniquePrefixName(filter);
        setIsUnique((prev) => ({
          ...prev,
          [filter.isPrefix ? "prefix" : "categoryName"]: response.data,
        }));
      } catch (error) {
        console.error("Error checking uniqueness:", error);
      }
    }, 500),
    []
  );

  const handleCreateCategorySubmit = async () => {
    try {
      const response = await createCategory(newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({ prefix: "", categoryName: "" });
      setOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      assetName: "",
      categoryId: "",
      installedDate: null as Dayjs | null,
      specification: "",
      state: AssetState.Available,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const payload = {
        assetName: values.assetName,
        categoryId: values.categoryId,
        installedDate: values.installedDate?.toISOString(),
        specification: values.specification,
        state: Number(values.state),
      } as CreateAssetRequest;
      try {
        const response = await createAsset(payload);
        const asset = response.data;
        const listAssetPageState = {
          alertString: `Asset ${asset.assetName} has been added!`,
          presetEntry: asset,
        } as ListPageState<Asset>;
        navigate(routeNames.asset.list, { state: listAssetPageState });
      } catch (error) {
        console.error("Error adding asset:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Create Asset</title>
      </Helmet>
      <RootBox>
        <Stack spacing={3}>
          <Typography variant="h6" gutterBottom color="primary">
            Create Asset
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="assetName"
                  name="assetName"
                  label="Asset Name"
                  value={formik.values.assetName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.assetName && Boolean(formik.errors.assetName)
                  }
                  helperText={
                    formik.touched.assetName && formik.errors.assetName
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  select
                  fullWidth
                  id="categoryId"
                  name="categoryId"
                  label="Category"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.categoryId &&
                    Boolean(formik.errors.categoryId)
                  }
                  helperText={
                    formik.touched.categoryId && formik.errors.categoryId
                  }
                >
                  <MenuItem value="">- Please choose -</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={handleCreateCategoryOpen}
                    style={{ color: "red" }}
                  >
                    Create a new category
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={formik.values.installedDate}
                  onChange={(value) =>
                    dayjs(value).isValid() &&
                    formik.setFieldValue("installedDate", value, true)
                  }
                  slotProps={{
                    textField: {
                      id: "installedDate",
                      name: "installedDate",
                      label: "Installed Date",
                      error: Boolean(formik.errors.installedDate),
                      helperText: formik.errors.installedDate,
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="specification"
                  name="specification"
                  label="Specification"
                  value={formik.values.specification}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.specification &&
                    Boolean(formik.errors.specification)
                  }
                  helperText={
                    formik.touched.specification && formik.errors.specification
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  error={formik.touched.state && Boolean(formik.errors.state)}
                >
                  <FormLabel id="state">State</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value={AssetState.Available}
                      control={<Radio />}
                      label="Available"
                    />
                    <FormControlLabel
                      value={AssetState.NotAvailable}
                      control={<Radio />}
                      label="Not Available"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Grid container spacing={1}>
                <Grid item>
                  <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </LoadingButton>
                </Grid>
                <Grid item>
                  <NoStyleLink to={routeNames.asset.list}>
                    <Button variant="outlined" color="primary">
                      Cancel
                    </Button>
                  </NoStyleLink>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Stack>
      </RootBox>

      <Dialog open={open} onClose={handleCreateCategoryClose}>
        <DialogTitle>Create a new category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the following fields to create a new category.
          </DialogContentText>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="prefix"
              name="prefix"
              label="Prefix"
              type="text"
              fullWidth
              value={newCategory.prefix}
              onChange={handleCreateCategoryChange}
              error={Boolean(
                newCategory.prefix.length < 2 || newCategory.prefix.length > 4
              )}
              helperText={
                newCategory.prefix.length < 2
                  ? "Prefix must be at least 2 characters"
                  : newCategory.prefix.length > 4
                  ? "Prefix must be at most 4 characters"
                  : !isUnique.prefix && newCategory.prefix !== ""
                  ? "Prefix must be unique"
                  : ""
              }
            />
            <TextField
              margin="dense"
              id="categoryName"
              name="categoryName"
              label="Category Name"
              type="text"
              fullWidth
              value={newCategory.categoryName}
              onChange={handleCreateCategoryChange}
              error={Boolean(newCategory.categoryName.length > 200)}
              helperText={
                newCategory.categoryName.length > 200
                  ? "Category Name must be at most 200 characters"
                  : !isUnique.categoryName && newCategory.categoryName !== ""
                  ? "Category Name must be unique"
                  : ""
              }
            />
            <DialogActions>
              <Button onClick={handleCreateCategoryClose} color="primary">
                Cancel
              </Button>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={handleCreateCategorySubmit}
                sx={{ backgroundColor: "red" }}
                disabled={
                  !(
                    newCategory.prefix.length >= 2 &&
                    newCategory.prefix.length <= 4 &&
                    isUnique.prefix &&
                    newCategory.categoryName.length <= 200 &&
                    isUnique.categoryName
                  )
                }
              >
                Create
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAssetPage;
