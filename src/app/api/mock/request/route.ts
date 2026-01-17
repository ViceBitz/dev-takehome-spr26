import { ResponseType } from "@/lib/types/apiResponse";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InputException } from "@/lib/errors/inputExceptions";
import connectDB from "@/lib/db/mongoose";
import Request from "@/lib/db/models/Request";
import { RequestStatus } from "@/lib/types/request";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import paginate from "@/lib/utils/pagination";
import { Types } from "mongoose";
import { InvalidInputError } from "@/lib/errors/inputExceptions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");
  try {
    await connectDB();

    const filter = status ? { status } : {};
    const allRequests = await Request.find(filter).sort({
      requestCreatedDate: -1,
    });

    const paginatedResult = paginate(allRequests, page, PAGINATION_PAGE_SIZE);

    return new Response(JSON.stringify(paginatedResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PUT(request: Request) {
  try {
    const req = await request.json();
    const { requestorName, itemRequested } = req;

    if (!requestorName || requestorName.length < 3 || requestorName.length > 30) {
      throw new InvalidInputError("Invalid requestor name");
    }
    if (!itemRequested || itemRequested.length < 2 || itemRequested.length > 100) {
      throw new InvalidInputError("Invalid item requested");
    }

    await connectDB();

    const newRequest = await Request.create({
      requestorName,
      itemRequested,
      requestCreatedDate: new Date(),
      lastEditedDate: new Date(),
      status: RequestStatus.PENDING,
    });

    return new Response(JSON.stringify(newRequest), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("PUT /api/mock/request error:", e);
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PATCH(request: Request) {
  try {
    const req = await request.json();
    const { id, status } = req;

    if (!id || !status) {
      throw new InvalidInputError("Missing id or status");
    }

    const validStatuses = Object.values(RequestStatus);
    if (!validStatuses.includes(status)) {
      throw new InvalidInputError("Invalid status");
    }

    await connectDB();

    const updatedRequest = await Request.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        status,
        lastEditedDate: new Date(),
      },
      { new: true }
    );

    if (!updatedRequest) {
      throw new InvalidInputError("Request not found");
    }

    return new Response(JSON.stringify(updatedRequest), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
