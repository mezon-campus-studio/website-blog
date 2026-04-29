import { asyncHandler } from "@/common/middleware/async-handler.middleware";
import prisma from "@/lib/prisma";
import { PrismaSearchRepository } from "@/modules/search/prisma-search.repository";
import { SearchController } from "@/modules/search/search.controller";
import { SearchService } from "@/modules/search/search.service";
import { Router } from "express";

const searchRouter = Router();
const searchRepository = new PrismaSearchRepository(prisma);
const searchService = new SearchService(searchRepository);
const searchController = new SearchController(searchService);

searchRouter.get("/", asyncHandler(searchController.getPostByKeyWord.bind(searchController)));

searchRouter.get("/tag/:tagId", asyncHandler(searchController.getPostByTag.bind(searchController)));

searchRouter.get("/:categoryId", asyncHandler(searchController.getPostByCategoryId.bind(searchController)));

export default searchRouter;