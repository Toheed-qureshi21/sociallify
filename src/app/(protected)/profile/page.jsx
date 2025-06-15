'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/components/UserContextProvider';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { CalendarIcon, EditIcon, FileTextIcon, HeartIcon, Loader2 } from 'lucide-react';
import { updateProfile } from '@/lib/api/profile';

import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import PostCard from '@/components/PostCard';

export default function Profile() {
    const { user, setUser, posts } = useUser();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [editForm, setEditForm] = useState({
        name: user.name || '',
        bio: user.bio || '',
    });
    const [loading, setLoading] = useState(false);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    console.log(posts);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const handleEditSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('bio', editForm.bio);

            if (previewImage && croppedAreaPixels) {
                const croppedFile = await getCroppedImg(previewImage, croppedAreaPixels);
                formData.append('profilePic', croppedFile);
            }

            const data = await updateProfile(formData);
            setUser(data?.user);
            setShowEditDialog(false);
            setPreviewImage(null);
            setSelectedFile(null);
            toast(data.message);
        } catch (err) {
            toast(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-w-lg mx-auto">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={user.profilePic || '/avatar.webp'} />
                                </Avatar>
                                <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
                                <p className="text-muted-foreground">@{user.name}</p>
                                <p className="mt-2 text-sm">{user.bio}</p>

                                <div className="w-full mt-6">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <div className="font-semibold">{user?.posts?.length}</div>
                                            <div className="text-sm text-muted-foreground">Posts</div>
                                        </div>
                                        <Separator orientation="vertical" />
                                        <div>
                                            <div className="font-semibold">{user?.followers?.length}</div>
                                            <div className="text-sm text-muted-foreground">Followers</div>
                                        </div>
                                        <Separator orientation="vertical" />
                                        <div>
                                            <div className="font-semibold">{user?.following?.length}</div>
                                            <div className="text-sm text-muted-foreground">Following</div>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full mt-4" onClick={() => setShowEditDialog(true)}>
                                    <EditIcon className="size-4 mr-2" />
                                    Edit Profile
                                </Button>

                                <div className="flex items-center mt-4 text-muted-foreground">
                                    <CalendarIcon className="size-4 mr-2" />
                                    Joined {new Date(user?.createdAt).toLocaleDateString('en-GB')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                        <div className="space-y-6 w-fit h-fit mx-auto">
                            {posts?.filter(post => post.userId?._id === user._id).length > 0 ? (
                                posts
                                    .filter(post => post.userId?._id === user._id)
                                    .map((post) => <PostCard key={post._id} post={post} user={user} />)
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No posts yet</div>
                            )}
                        </div>
                 

                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    name="name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Bio</Label>
                                <Textarea
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="min-h-[100px]"
                                    placeholder="Tell us about yourself"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Profile Picture</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileChange}
                                />
                                {previewImage && (
                                    <div className="relative w-full h-64 bg-black">
                                        <Cropper
                                            image={previewImage}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleEditSubmit} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
