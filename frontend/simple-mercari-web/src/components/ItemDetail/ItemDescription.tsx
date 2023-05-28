import { Item, ItemStatus } from "../../common/interfaces";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { useCookies } from "react-cookie";
import { fetcher } from "../../helper";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import { Chip } from "@mui/material";

export const ItemDescription: React.FC<{ item: Item, isOwner: boolean}>  = ({item, isOwner}) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(["token", "userID"]);
    const params = useParams();

    const onSubmit = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        fetcher<Item[]>(`/purchase/${params.id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.token}`,
            },
            body: JSON.stringify({
                user_id: Number(cookies.userID),
            }),
        })
            .then(() => window.location.reload())
            .catch((err) => {
                console.log(`POST error:`, err);
                toast.error("Error: " + err.message);
            });
    };

    return (
        <div className={"description-container"}>
            <h1>{item.name}</h1>
            <h2><span id={"yen-symbol"}>¥</span> {item.price.toLocaleString()}</h2>
            <Chip label={item.category_name} component="a" /> {/* TODO: Navigate to category view on clicking */}

            {item.status == ItemStatus.ItemStatusSoldOut ? (
                <Button disabled={true} onClick={onSubmit} id="MerDisableButton">
                    SoldOut
                </Button>
            ) : (
                <>
                    {isOwner && (
                        <Button
                            onClick={() => navigate(`/edit-item/${item.id}`)} // Navigate to /edit-item/:itemId when the Edit button is clicked
                            id="MerButton"
                        >
                            Edit
                        </Button>
                    )}
                    <Button variant="contained" onClick={onSubmit} id="buy-now-btn" color="error" sx={{ mt: 3}}>
                        Buy now
                    </Button>
                </>
            )}

            <p>{item.description}</p>
            <p>User: {item.user_id}</p> {/* TODO: Display user name instead of user id */}
        </div>
    );
}