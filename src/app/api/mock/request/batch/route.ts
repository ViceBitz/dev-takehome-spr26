import { ResponseType } from "@/lib/types/apiResponse";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InputException } from "@/lib/errors/inputExceptions";
import connectDB from "@/lib/db/mongoose";
import Request from "@/lib/db/models/Request";
import { RequestStatus } from "@/lib/types/request";
import { Types } from "mongoose";
import { InvalidInputError } from "@/lib/errors/inputExceptions";

export async function PATCH(request: Request) {
  try {
    const req = await request.json();
    const { ids, status } = req;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new InvalidInputError("Missing or invalid ids array");
    }

    if (!status) {
      throw new InvalidInputError("Missing status");
    }

    const validStatuses = Object.values(RequestStatus);
    if (!validStatuses.includes(status)) {
      throw new InvalidInputError("Invalid status");
    }

    await connectDB();

    const objectIds = ids.map((id: string) => new Types.ObjectId(id));

    const result = await Request.updateMany(
      { _id: { $in: objectIds } },
      {
        status,
        lastEditedDate: new Date(),
      }
    );

    if (result.matchedCount === 0) {
      throw new InvalidInputError("No requests found with provided ids");
    }

    return new Response(
      JSON.stringify({
        message: `Successfully updated ${result.modifiedCount} requests`,
        modifiedCount: result.modifiedCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function DELETE(request: Request) {
  try {
    const req = await request.json();
    const { ids } = req;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new InvalidInputError("Missing or invalid ids array");
    }

    await connectDB();

    const objectIds = ids.map((id: string) => new Types.ObjectId(id));

    const result = await Request.deleteMany({
      _id: { $in: objectIds },
    });

    if (result.deletedCount === 0) {
      throw new InvalidInputError("No requests found with provided ids");
    }

    return new Response(
      JSON.stringify({
        message: `Successfully deleted ${result.deletedCount} requests`,
        deletedCount: result.deletedCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
