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
  TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { FC, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { RootBox } from "../../../components/form";
import { NoStyleLink } from "../../../components/noStyleLink";
import { routeNames } from "../../../constants/routeName";
import { toISOStringWithoutTimezone } from "../../../helpers/helper";
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
dayjs.locale("en");

const isPastDate = (date: any) =>
  dayjs(date).isBefore(dayjs(), "day") || dayjs(date).isSame(dayjs(), "day");
const isValidDate = (date: any) => {
  const parsedDate = dayjs(date);
  return parsedDate.isValid() && parsedDate.year() > 1900;
};

const validationSchema = yup.object({
  assetName: yup
    .string()
    .required("Please enter asset name")
    .min(2, "The asset name length should be 2-200 characters")
    .max(200, "The asset name length should be 2-200 characters")
    .test(
      "no-only-spaces",
      "Please enter Asset name",
      (value) => value.trim().length > 0
    ),
  categoryId: yup.string().required("Category is required"),
  installedDate: yup
    .mixed()
    .required("Please enter valid installed date")
    .test("is-valid-date", "Please enter a valid date", function (value) {
      return isValidDate(value);
    })
    .test(
      "is-past-date",
      "Installed date must be in present or in the past",
      function (value) {
        return isValidDate(value) && isPastDate(value);
      }
    ),
  specification: yup
    .string()
    .required("Please enter specification")
    .min(2, "Specification length should be 2-500 characters")
    .max(500, "Specification length can't be more than 500 characters.")
    .test(
      "no-only-spaces",
      "Please enter specification",
      (value) => value.trim().length > 0
    ),
  state: yup
    .number()
    .required("Please enter state")
    .oneOf(
      [AssetState.Available, AssetState.NotAvailable],
      "Invalid state value"
    ),
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

  const resetCategoryForm = () => {
    setNewCategory({ prefix: "", categoryName: "" });
    setIsUnique({ prefix: false, categoryName: false });
  };

  const handleCreateCategoryOpen = () => {
    resetCategoryForm();
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
      newCategory.categoryName = newCategory.categoryName.trim();
      newCategory.prefix = newCategory.prefix.trim();
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
    validateOnMount: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const payload = {
        assetName: values.assetName.trim(),
        categoryId: values.categoryId,
        installedDate: toISOStringWithoutTimezone(values.installedDate!),
        specification: values.specification.trim(),
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

  const handleInstalledDateChanges = (value: Dayjs | null) => {
    if (dayjs(value).isValid()) {
      formik.setFieldValue("installedDate", value, true);
    } else {
      formik.setFieldValue("installedDate", null, true);
    }
  };

  const handleInstalledDateBlur = () => {
    formik.setFieldTouched("installedDate", true);
  };

  return (
    <>
      <Helmet>
        <title>Create New Asset</title>
      </Helmet>
      <RootBox>
        <Stack spacing={3}>
          <Typography variant="h6" gutterBottom color="primary">
            Create New Asset
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
                    sx={{ color: "red", position: "sticky", paddingBottom: "8px", bottom: 0, backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "white"
                      }
                     }}
                  >
                    Create a new category
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  format="DD/MM/YYYY"
                  maxDate={dayjs()}
                  value={formik.values.installedDate}
                  onChange={handleInstalledDateChanges}
                  slotProps={{
                    textField: {
                      id: "installedDate",
                      name: "installedDate",
                      label: "Installed Date",
                      onBlur: handleInstalledDateBlur,
                      error:
                        formik.touched.installedDate &&
                        Boolean(formik.errors.installedDate),
                      helperText:
                        formik.touched.installedDate &&
                        formik.errors.installedDate,
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
                  <FormLabel id="state">State *</FormLabel>
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
                    disabled={!formik.isValid || formik.isSubmitting}
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
          <form>
            <TextField
              autoFocus
              margin="dense"
              id="prefix"
              name="prefix"
              label="Prefix *"
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
                  : /\s/.test(newCategory.prefix)
                  ? "Prefix should not contain spaces"
                  : !isUnique.prefix && newCategory.prefix !== ""
                  ? "Prefix is already existed. Please enter a different prefix (EL, CM)"
                  : !/^[a-zA-Z]+$/.test(newCategory.prefix)
                  ? "Category prefix should only contain alphabets"
                  : ""
              }
              FormHelperTextProps={{
                sx: { color: "red" },
              }}
            />
            <TextField
              margin="dense"
              id="categoryName"
              name="categoryName"
              label="Category Name *"
              type="text"
              fullWidth
              value={newCategory.categoryName}
              onChange={handleCreateCategoryChange}
              error={Boolean(newCategory.categoryName.length > 200)}
              helperText={
                newCategory.categoryName.length > 200
                  ? "Category Name must be at most 200 characters"
                  : newCategory.categoryName.trim().length < 2
                  ? "Category Name must be at least 2 characters"
                  : newCategory.categoryName.trim().length === 0
                  ? "Please enter a category prefix"
                  : !isUnique.categoryName && newCategory.categoryName !== ""
                  ? "Category is already existed. Please enter a different category (Electronic, Computer)"
                  : ""
              }
              FormHelperTextProps={{
                sx: { color: "red" },
              }}
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
                    newCategory.prefix.trim().length >= 2 &&
                    newCategory.prefix.length <= 4 &&
                    !/\s/.test(newCategory.prefix) &&
                    isUnique.prefix &&
                    newCategory.categoryName.length <= 200 &&
                    newCategory.categoryName.trim().length >= 2 &&
                    isUnique.categoryName &&
                    /^[a-zA-Z]+$/.test(newCategory.prefix)
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
