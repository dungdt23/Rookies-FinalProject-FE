import {
  Box,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTableHead, {
  TableHeadInfo,
} from "../../../components/table/CustomTableHead";
import { toStandardFormat } from "../../../helpers/formatDate";
import { addSpacesToCamelCase } from "../../../helpers/helper";
import { fetchAssetHistory } from "../../../services/asset.service";
import {
  AssignmentState,
  HistoricalAssignment,
} from "../../../types/assignment";
import { PaginateResponse } from "../../../types/common";

const AssetHistoryPage: FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [assignments, setAssignments] = useState<HistoricalAssignment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [assetName, setAssetName] = useState<string>();
  const [assetCode, setAssetCode] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const TABLE_HEAD: TableHeadInfo[] = [
    {
      id: "Date",
      label: "Date"
    },
    {
      id: "AssignedBy",
      label: "Assigned By"
    },
    {
      id: "AssignedTo",
      label: "Assigned To"
    },
    {
      id: "State",
      label: "State"
    },
    {
      id: "ReturnDate",
      label: "Return Date"
    },
  ]
  function onRequestSort(_: string): void {

  }
  useEffect(() => {
    const getAssignments = async () => {
      setIsLoading(true);
      try {
        const data: PaginateResponse<HistoricalAssignment> =
          await fetchAssetHistory(assetId ?? "", page, pageSize);
        console.log(data);
        setAssignments(data.data);
        setAssetName(data.data[0].assetName);
        setAssetCode(data.data[0].assetCode);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching asset history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getAssignments();
  }, [assetId, page, pageSize]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" color='primary'>
        Assignment History Of {assetCode} - {assetName} Asset
      </Typography>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : assignments.length > 0 ? (
        <TableContainer>
          <Table>
            <CustomTableHead
              columns={TABLE_HEAD}
              order={'asc'}
              orderBy={'asc'}
              onRequestSort={onRequestSort}
            />
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    {toStandardFormat(assignment.assignedDate)}
                  </TableCell>
                  <TableCell>{assignment.assignedBy}</TableCell>
                  <TableCell>{assignment.assignedTo}</TableCell>
                  <TableCell>{addSpacesToCamelCase(AssignmentState[assignment.state])}</TableCell>
                  <TableCell>{assignment.returnRequest?.returnedDate
                    ? toStandardFormat(assignment.returnRequest.returnedDate)
                    : null}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            count={Math.ceil(totalCount / pageSize)}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </TableContainer>
      ) : (
        <Typography variant="body1">
          No assignment history found for this asset.
        </Typography>
      )}
    </Box>
  );
};

export default AssetHistoryPage;
