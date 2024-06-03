import { useState } from "react";
import { GroupedData } from "../../../utils/type";
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import ItemToBuy from "@/app/components/ItemToBuy";
import { ShopList } from "./ShopList";
import ModalToBuyRegistration from "./ModalToBuyRegistration";
import TaxSwitch from "./TaxSwitch";

import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  // MouseSensor,
  // TouchSensor,
  UniqueIdentifier,
  closestCenter,
  // useSensor,
  // useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Droppable from "./Droppable";
import SortableItem from "./SortableItem";
import { supabase } from "../../../utils/supabase";
import useStore, { useSortableStore, useStockStore } from "@/store";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

type Props = { groupedDataArr: GroupedData[] };

const ToBuyList = ({ groupedDataArr }: Props) => {
  // ドラッグ＆ドロップでソート可能なリスト
  const user = useStore((state) => state.user);
  let { setStocks } = useStockStore();
  const onUpdate = (data: any | undefined) => setStocks(data);

  const [items, setItems] = useState(groupedDataArr);

  // リストのリソースID
  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  // ドラッグの開始、移動、終了などの入力方法
  // const sensors = useSensors(
  //   useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
  //   useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  // );

  // ドラッグ開始時に発火するイベント
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
  }
  // ドラッグ終了時に発火するイベント
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldSortId = items.findIndex((item) => item.id === active.id);
      const newSortId = items.findIndex((item) => item.id === over?.id);

      const sortedArray = arrayMove(items, oldSortId, newSortId).filter(
        (el) => el.shop_name
      );
      const selectedItem = sortedArray.filter((item) => item.id === active.id);

      const shopItem = sortedArray.filter(
        (item) => item.shop_name === selectedItem[0].shop_name
      );

      try {
        setItems(() => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over?.id);
          return arrayMove(items, oldIndex, newIndex);
        });

        for await (const [key, value] of Object.entries(shopItem)) {
          const sortId = parseInt(key, 10);
          await supabase
            .from("stocks")
            .update({ sort_id: sortId })
            .eq("id", value.id);
        }
      } catch (error: any) {
        console.log("Error");
      }
    }
    setActiveId("");
  }

  const { isSortable, setIsSortable } = useSortableStore();
  async function handleChange() {
    setIsSortable();
    const { data: updatedStocks } = await supabase
      .from("stocks")
      .select("*")
      .eq("user_id", user.id);
    onUpdate(updatedStocks);
  }

  return (
    <Box sx={{ marginBottom: "80px" }}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            marginBottom: "24px",
          }}
        >
          <Typography variant="h2" sx={{ fontSize: "24px" }}>
            買い物リスト
          </Typography>
          <ModalToBuyRegistration groupedDataArr={groupedDataArr} />
        </Stack>
        {/* 税表示切替 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ marginRight: "8px" }}
        >
          <Stack
          direction="row"
          alignItems="center"
          >
          <ToggleButtonGroup
            size="small"
            color="primary"
            exclusive
            value={isSortable}
            onChange={handleChange}
          >
            <ToggleButton value={false}>
              <Tooltip title="編集モード" placement="top">
                <EditNoteOutlinedIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={true}>
              <Tooltip title="並べ替えモード" placement="top">
                <SwapVertOutlinedIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography marginLeft={2} color="primary" variant="h6">
            { isSortable ? "並べ替えモード" : "編集モード"}
          </Typography>
          </Stack>
          <TaxSwitch />
        </Stack>

        {ShopList.map((shop) =>
          groupedDataArr.some(
            (groupedData) =>
              groupedData.shop_name === shop.shopName && groupedData.to_buy
          ) ? (
            <Box
              key={shop.id}
              sx={{
                boxShadow: 2,
                padding: "16px",
                borderRadius: 2,
                marginBlock: "10px",
              }}
            >
              <Typography variant="body1">
                {shop.shopName ? shop.shopName : "購入店舗未定"}
              </Typography>

              <DndContext
                // sensors={sensors}
                modifiers={[restrictToVerticalAxis,restrictToParentElement]}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                autoScroll
              >
                <Droppable key={shop.id} id={shop.id}>
                  <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                  >
                    {isSortable
                      ? items.map(
                          (item) =>
                            item.to_buy === true &&
                            item.shop_name === shop.shopName && (
                              <SortableItem id={item.id} key={item.id}>
                                <ItemToBuy {...item} />
                              </SortableItem>
                            )
                        )
                      : groupedDataArr
                          .sort((a, b) => a.sort_id - b.sort_id)
                          .map(
                            (groupedData) =>
                              groupedData.to_buy === true &&
                              groupedData.shop_name === shop.shopName && (
                                <ItemToBuy
                                  key={groupedData.id}
                                  {...groupedData}
                                />
                              )
                          )}
                  </SortableContext>
                </Droppable>
              </DndContext>
            </Box>
          ) : null
        )}
        {groupedDataArr.some((groupedData) => groupedData.to_buy) ? null : (
          <Box
            sx={{
              boxShadow: 2,
              padding: "16px",
              borderRadius: 2,
              marginBlock: "10px",
            }}
          >
            <Typography variant="body1">買い物リストは空です</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ToBuyList;
