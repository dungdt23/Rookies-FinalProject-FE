import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
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
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { NoStyleLink } from "../../../components/noStyleLink";
import { routeNames } from "../../../constants/routeName";
import { useAuth } from "../../../contexts/AuthContext";
import { editAssetById, fetchAssetById } from "../../../services/asset.service";
import { Asset, AssetState, CreateAssetRequest } from "../../../types/asset";
import { Category } from "../../../types/category";
import { ListPageState } from "../../../types/common";
import { fetchAllCategory } from "../../../services/category.service";

const RootBox = styled(Box)(() => ({
  maxWidth: "100vh",
  margin: "auto",
}));

dayjs.locale("en");

const isPastDate = (date: Dayjs) => dayjs(date).isBefore(dayjs(), "day");

const validationSchema = yup.object({
  assetName: yup
    .string()
    .required("Asset Name is required")
    .max(200, "Asset Name length can't be more than 200 characters."),
  installedDate: yup
    .object()
    .required("Installed Date is required")
    .test(
      "is-past-date",
      "Installed date must be in the past",
      function (value) {
        return isPastDate(value as Dayjs);
      }
    ),
  specification: yup
    .string()
    .required("Specification is required")
    .max(500, "Specification length can't be more than 500 characters."),
  state: yup
    .number()
    .required("State is required")
    .oneOf(
      [AssetState.Available, AssetState.NotAvailable, AssetState.WaitingForRecycling, AssetState.Recycled],
      "Invalid state value"
    ),
});

const EditAssetPage: FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAssetDetails = useCallback(async () => {
    try {
      const response = await fetchAssetById(assetId!);
      const asset = response.data;
      formik.setValues({
        assetName: asset.assetName,
        installedDate: dayjs(asset.installedDate),
        specification: asset.specification,
        state: asset.state,
      });

      // Find and set the current category
      const fetchCategoryData = async () => {
        try {
          const categoryResponse = await fetchAllCategory();
          const fetchedCategories = categoryResponse.data;
          setCategories(fetchedCategories);

          const matchedCategory = fetchedCategories.find(
            (fetchCate: Category) => fetchCate.categoryName === asset.category
          );
          setCurrentCategory(matchedCategory || null);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategoryData();
    } catch (error) {
      console.error("Error fetching asset details:", error);
    }
  }, [assetId]);

  useEffect(() => {
    fetchAssetDetails();
  }, [fetchAssetDetails]);

  const formik = useFormik({
    initialValues: {
      assetName: "",
      installedDate: null as Dayjs | null,
      specification: "",
      state: AssetState.Available,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const payload = {
        assetName: values.assetName,
        categoryId: currentCategory?.id || "",
        installedDate: values.installedDate?.toISOString(),
        specification: values.specification,
        state: Number(values.state),
      } as CreateAssetRequest;
      try {
        const response = await editAssetById(assetId!, payload);
        const asset = response.data;
        const listAssetPageState = {
          alertString: `Asset ${asset.assetName} has been updated!`,
          presetEntry: asset,
        } as ListPageState<Asset>
        navigate(routeNames.asset.list, { state: listAssetPageState });
      } catch (error) {
        console.error("Error updating asset:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Edit Asset</title>
      </Helmet>
      <RootBox>
        <Stack spacing={3}>
          <Typography variant="h6" gutterBottom color="primary">
            Edit Asset
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
                  value={currentCategory?.id || ""}
                  disabled={Boolean(currentCategory)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
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
                  multiline
                  rows={4}
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
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  required
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  component="fieldset"
                >
                  <FormLabel id="state">State</FormLabel>
                  <RadioGroup
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <FormControlLabel
                      value={AssetState.Available}
                      control={<Radio />}
                      label="Available"
                    />
                    <FormControlLabel
                      value={AssetState.NotAvailable}
                      control={<Radio />}
                      label="Not available"
                    />
                    <FormControlLabel
                      value={AssetState.WaitingForRecycling}
                      control={<Radio />}
                      label="Waiting for recycling"
                    />
                    <FormControlLabel
                      value={AssetState.Recycled}
                      control={<Radio />}
                      label="Recycled"
                    />
                  </RadioGroup>
                  {formik.touched.state && formik.errors.state && (
                    <Typography variant="caption" color="error">
                      {formik.errors.state}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    disabled={!(formik.isValid && formik.dirty)}
                  >
                    Save
                  </LoadingButton>
                  <NoStyleLink to={routeNames.asset.list}>
                    <Button variant="outlined">Cancel</Button>
                  </NoStyleLink>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </RootBox>
    </>
  );
};

export default EditAssetPage
