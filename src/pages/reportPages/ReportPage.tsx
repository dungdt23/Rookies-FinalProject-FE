import {
  Box,
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CircularProgressWrapper } from "../../components/loading";
import { RootListBox } from "../../components/styledComponents";
import { CustomTableCell } from "../../components/table";
import CustomTableHead, {
  Order,
  TableHeadInfo,
} from "../../components/table/CustomTableHead";
import { removeUndefinedValues } from "../../helpers/removeUndefined";
import {
  GetAllReportParams,
  TypeReportSort,
  exportReport,
  fetchReport,
} from "../../services/report.service";
import { ReportResponse } from "../../types/report";

const StyledTableContainer = styled(TableContainer)(() => ({
  border: "0px",
}));

const ExportButton = styled(Button)(() => ({
  padding: "1rem 2rem",
  height: "100%",
  marginLeft: "87%",
}));

const TABLE_HEAD: TableHeadInfo[] = [
  {
    id: TypeReportSort[TypeReportSort.CategoryName],
    label: "Category Name",
    sortable: true,
  },
  { id: TypeReportSort[TypeReportSort.Total], label: "Total", sortable: true },
  {
    id: TypeReportSort[TypeReportSort.Assigned],
    label: "Assigned",
    sortable: true,
  },
  {
    id: TypeReportSort[TypeReportSort.Available],
    label: "Available",
    sortable: true,
  },
  {
    id: TypeReportSort[TypeReportSort.NotAvailable],
    label: "Not Available",
    sortable: true,
  },
  {
    id: TypeReportSort[TypeReportSort.WaitingForRecycling],
    label: "Waiting for Recycling",
    sortable: true,
  },
  {
    id: TypeReportSort[TypeReportSort.Recycled],
    label: "Recycled",
    sortable: true,
  },
];

const ReportPage = () => {
  const defaultSortOrder: Order = "asc";
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [order, setOrder] = useState<Order>(defaultSortOrder);
  const [orderBy, setOrderBy] = useState<string>(TABLE_HEAD[0].id);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(15);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const getReports = async () => {
    setIsFetching(true);
    let params: GetAllReportParams = {
      sortby: TypeReportSort[orderBy as keyof typeof TypeReportSort],
      ascending: order === "asc",
      index: page,
      size: pageSize,
    };

    removeUndefinedValues<GetAllReportParams>(params);

    try {
      const data = await fetchReport(params);
      setReports(data.data);
      setTotalCount(data.totalCount);
    } catch (error: any) {
      if (error.response.data.statusCode === 404) {
        setReports([]);
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [order, orderBy, page, pageSize]);

  function onRequestSort(property: string): void {
    // toggle sort
    if (orderBy === property) {
      setOrder(order === "asc" ? "desc" : "asc");
      return;
    }
    setOrderBy(property);
    setOrder(defaultSortOrder);
  }

  const handleExport = async () => {
    await exportReport();
  };
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <Helmet>
        <title>Manage Report</title>
      </Helmet>
      <RootListBox sx={{ mb: "1rem" }}>
        <Typography variant="h5" color="primary">
          Report
        </Typography>        
        <ExportButton
          variant="contained"
          color="primary"
          onClick={handleExport}
        >
          Export
        </ExportButton>
      </RootListBox>
      <RootListBox>
        <StyledTableContainer>
          <CircularProgressWrapper loading={isFetching}>
            <Table>
              <CustomTableHead
                columns={TABLE_HEAD}
                order={order}
                orderBy={orderBy}
                onRequestSort={onRequestSort}
              />
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.categoryName}>
                    <CustomTableCell>{report.categoryName}</CustomTableCell>
                    <CustomTableCell>{report.total}</CustomTableCell>
                    <CustomTableCell>{report.assigned}</CustomTableCell>
                    <CustomTableCell>{report.available}</CustomTableCell>
                    <CustomTableCell>{report.notAvailable}</CustomTableCell>
                    <CustomTableCell>
                      {report.waitingForRecycling}
                    </CustomTableCell>
                    <CustomTableCell>{report.recycled}</CustomTableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && isFetching && (
                  <TableRow style={{ height: 200 }} />
                )}
                {reports.length === 0 && !isFetching && (
                  <TableRow style={{ height: 200 }}>
                    <CustomTableCell align="center" colSpan={TABLE_HEAD.length}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" paragraph>
                          No results found.
                        </Typography>
                      </Box>
                    </CustomTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CircularProgressWrapper>
        </StyledTableContainer>
        {totalCount !== 0 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={Math.ceil(totalCount / pageSize)}
              page={page}
              onChange={handleChangePage}
            />
          </Box>
        )}
      </RootListBox>
    </>
  );
};

export default ReportPage;
