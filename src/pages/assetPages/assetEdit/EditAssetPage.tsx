import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
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
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { NoStyleLink } from "../../../components/noStyleLink";
import { routeNames } from "../../../constants/routeName";
import { editAssetById, fetchAssetById } from "../../../services/asset.service";
import { fetchAllCategory } from "../../../services/category.service";
import { Asset, AssetState, CreateAssetRequest } from "../../../types/asset";
import { Category } from "../../../types/category";
import { ListPageState } from "../../../types/common";
import { toISOStringWithoutTimezone } from "../../../helpers/helper";
import { RootBox } from "../../../components/form";
import { HubConnectionBuilder } from "@microsoft/signalr";
import signalrService from "../../../services/signalr.service";
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
    .min(2, 'The asset name length should be 2-200 characters')
    .max(200, 'The asset name length should be 2-200 characters')
    .test(
      "no-only-spaces",
      "Please enter Asset name",
      (value) => value.trim().length > 0
    ),
    installedDate: yup
    .mixed()
    .required("Please enter installed date")
    .test("is-valid-date", "Please enter valid installed date", function (value) {
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
      [AssetState.Available, AssetState.NotAvailable, AssetState.WaitingForRecycling, AssetState.Recycled],
      "Invalid state value"
    ),
});

const EditAssetPage: FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [initialValues, setInitialValues] = useState({
    assetName: "",
    installedDate: null as Dayjs | null,
    specification: "",
    state: AssetState.Available,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // const connection = new HubConnectionBuilder()
    // .withUrl("https://localhost:7106/signalr-hub") 
    // .build();

    // connection.on("Deleted", (deletedAssetId) => {
    //   if (deletedAssetId === assetId) {
    //     navigate("/assets");
    //   }
    // });

    // connection.start().catch(err => console.error("Connection failed: ", err));

    // return () => {
    //   connection.stop();
    // };
    const initializeSignalR = async() => {
      await signalrService.startConnection();
      signalrService.onDeleted((deletedAssetId) => {
        if (deletedAssetId === assetId) {
          navigate("/assets");
        }
      });
    }
    initializeSignalR();
    return () => {
      signalrService.stopConnection();
    };
  }, [assetId, navigate]);

  const fetchAssetDetails = useCallback(async () => {
    try {
      const response = await fetchAssetById(assetId!);
      const asset = response.data;
      if(asset === null) {
        navigate(routeNames.notFound);  
      }
      const formValues = {
        assetName: asset.assetName,
        installedDate: dayjs(asset.installedDate),
        specification: asset.specification,
        state: asset.state,
      };

      setInitialValues(formValues);
      formik.setValues(formValues);

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
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const payload = {
        assetName: values.assetName.trim(),
        categoryId: currentCategory?.id || "",
        installedDate: toISOStringWithoutTimezone(values.installedDate!),
        specification: values.specification.trim(),
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

  const handleInstalledDateChanges = (value: Dayjs | null) => {
    if (dayjs(value).isValid()) {
      formik.setFieldValue('installedDate', value, true)
    }
  }

  const handleInstalledDateBlur = () => {
    formik.setFieldTouched('installedDate', true)
  }

  const hasFormChanged = () => {
    return JSON.stringify(formik.values) !== JSON.stringify(initialValues);
  }

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
                  value={currentCategory?.id ?? ""}
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
                  maxDate={dayjs()}
                  value={formik.values.installedDate}
                  onChange={(value) =>
                    formik.setFieldValue("installedDate", value)
                  }
                  slotProps={{
                    textField: {
                      id: "installedDate",
                      name: "installedDate",
                      label: "Installed Date",
                      onBlur: handleInstalledDateBlur,
                      error: formik.touched.installedDate && Boolean(formik.errors.installedDate),
                      helperText: formik.touched.installedDate && formik.errors.installedDate,
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
                    onChange={(event) => {
                      formik.setFieldValue("state", Number(event.currentTarget.value), true);
                    }}
                    onBlur={formik.handleBlur}
                  >
                    <FormControlLabel
                      value={AssetState.Available}
                      control={<Radio />}
                      label="Available"
                      checked={formik.values.state === AssetState.Available}
                    />
                    <FormControlLabel
                      value={AssetState.NotAvailable}
                      control={<Radio />}
                      label="Not available"
                      checked={formik.values.state === AssetState.NotAvailable}
                    />
                    <FormControlLabel
                      value={AssetState.WaitingForRecycling}
                      control={<Radio />}
                      label="Waiting for recycling"
                      checked={formik.values.state === AssetState.WaitingForRecycling}
                    />
                    <FormControlLabel
                      value={AssetState.Recycled}
                      control={<Radio />}
                      label="Recycled"
                      checked={formik.values.state === AssetState.Recycled}
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
                    disabled={!(formik.isValid && formik.dirty && hasFormChanged())}
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

export default EditAssetPage;
